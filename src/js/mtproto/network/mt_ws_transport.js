//MTProto Intermediate Obfuscated Codec W.I.P.
//Copyright 2019 Oleg Tsenilov
//https://github.com/OTsenilov

import {mt_inob_send, mt_inob_recv} from "./mt_inob_codec"

var transportation_streams = new Map();

var high_level_processor;
var high_level_context;

function mt_init_transportation(url)
{
    var transportation_socket = new WebSocket(url, "binary");
    transportation_socket.binaryType = "arraybuffer";

    transportation_socket.onopen = function(ev)
    {
        var transportation_stream = transportation_streams.get(url);
        for (var i = 0; i < transportation_stream.transportation_queue_len; i++) {
            mt_inob_send(transportation_socket, transportation_stream.transportation_queue[i], transportation_stream.transportation_queue[i].byteLength);
            //console.log("transported buffer / 0");
            //console.log(transportation_queue[i].byteLength);
        }
        transportation_stream.transportation_init = true;
    };

    transportation_socket.onmessage = function(ev)
    {
        console.log("SOCK_RESPONSE");
        var data_buffer = mt_inob_recv(ev);
        high_level_processor.call(high_level_context, data_buffer);
    };

    transportation_socket.onerror = function(ev)
    {
        console.log("SOCK_ERROR");
    };

    transportation_socket.onclose = function(ev)
    {
        console.log("SOCK_CLOSE");
        if(!(ev.wasClean))
        {
            console.log("CRASHED");
        }
        console.log('code: ' + ev.code + ' reason: ' + ev.reason);
    };
    
    transportation_streams.set(url, {
                                        transportation_socket: transportation_socket,
                                        transportation_init: false,
                                        transportation_establishing: false,
                                        transportation_queue: [],
                                        transportation_queue_len: 0
                                    });
}

export function mt_ws_set_processor(processor, context)
{
    high_level_processor = processor;
    high_level_context = context;
}

export function mt_ws_transport(url, buffer)
{
    var transportation_init = false;
    var transportation_establishing = false;
    var transportation_stream = transportation_streams.get(url);
    if(transportation_stream != undefined)
    {
        transportation_init = transportation_stream.transportation_init;
        transportation_establishing = transportation_stream.transportation_establishing;
    }

    if(!transportation_init)
    {
        if(!transportation_establishing)
        {
            mt_init_transportation(url);
            transportation_stream = transportation_streams.get(url);

            transportation_stream.transportation_queue[transportation_stream.transportation_queue_len] = buffer;
            ++(transportation_stream.transportation_queue_len);
            transportation_stream.transportation_establishing = true;
            //console.log("added to transportation_queue / 0");
        }
        else
        {
            transportation_stream.transportation_queue[transportation_queue_len] = buffer;
            ++(transportation_stream.transportation_queue_len);
            //console.log("added to transportation_queue");
        }
        return;
    }
    mt_inob_send(transportation_stream.transportation_socket, buffer, buffer.byteLength);
    //console.log("transported buffer");
}