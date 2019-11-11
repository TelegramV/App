//MTProto Intermediate Obfuscated Codec W.I.P.
//Copyright 2019 Oleg Tsenilov
//https://github.com/OTsenilov

import {mt_inob_send, mt_inob_recv} from "./mt_inob_codec"

var transportation_socket;
var high_level_processor;
var high_level_context;
var transportation_init = false;
var transportation_establishing = false;

var transportation_queue = [];
var transportation_queue_len = 0;

function mt_init_transportation(url)
{
    transportation_socket = new WebSocket(url, "binary");
    transportation_socket.binaryType = "arraybuffer";

    transportation_socket.onopen = function(ev)
    {
        for (var i = 0; i < transportation_queue_len; i++) {
            mt_inob_send(transportation_socket, transportation_queue[i], transportation_queue[i].byteLength);
            //console.log("transported buffer / 0");
            //console.log(transportation_queue[i].byteLength);
        }
        transportation_init = true;
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
}

export function mt_ws_set_processor(processor, context)
{
    high_level_processor = processor;
    high_level_context = context;
}

export function mt_ws_transport(url, buffer)
{
    if(!transportation_init)
    {
        if(!transportation_establishing)
        {
            mt_init_transportation(url);
            transportation_queue[transportation_queue_len] = buffer;
            ++transportation_queue_len;
            transportation_establishing = true;
            //console.log("added to transportation_queue / 0");
        }
        else
        {
            //console.log("added to transportation_queue");
            transportation_queue[transportation_queue_len] = buffer;
            ++transportation_queue_len;
        }
        return;
    }
    mt_inob_send(transportation_socket, buffer, buffer.byteLength);
}