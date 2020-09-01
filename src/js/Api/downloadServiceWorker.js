let task_counter = 1; // do not assign to zero (0)

const awaitingResolves = new Map();

function downloadFilePart(e: FetchEvent, fileId, start, end) {
    const client = self.clients.get(e.clientId);

    if (!client) {
        console.error("NO CLIENT FOUND", e.clientId, self.clients);
        return Promise.reject();
    }

    return client.then(client => {
        const taskId = task_counter++;

        return new Promise(resolve => {
            awaitingResolves.set(taskId, resolve);

            client.postMessage({
                type: "downloadFilePart",
                taskId,
                fileId,
                start,
                end,
            });
        });
    });
}

self.addEventListener("fetch", (e: FetchEvent) => {
    const {url} = e.request;

    if (url.includes("/stream/")) {
        // console.log("pizda", e, e.request);

        const {url} = e.request;
        const range = e.request.headers.get("range");
        const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(range || '');
        const start = Number(bytes[1]);
        let end = Number(bytes[2]);

        if (!end) {
            end = start + 256 * 256;
        }

        const urlSplit = url.split("/");
        const fileId = urlSplit[urlSplit.length - 1];

        e.respondWith(downloadFilePart(e, fileId, start, end)
            .then(({bytes, mimeType, documentSize}) => {
                // console.warn("RESULT", bytes, mimeType, documentSize);

                const arrayBuffer = bytes.buffer;

                const partSize = Math.min(end - start + 1, arrayBuffer.byteLength);
                end = start + partSize - 1;
                const arrayBufferPart = arrayBuffer.slice(0, partSize);

                return new Response(arrayBufferPart, {
                    status: 206,
                    statusText: "Partial Content",
                    headers: [
                        ['Accept-Ranges', 'bytes'],
                        ['Content-Range', `bytes ${start}-${end}/${documentSize}`],
                        ['Content-Type', mimeType],
                        ['Content-Length', String(partSize)],
                    ],
                });
            }));
    } else {
        e.respondWith(fetch(e.request));
    }
});

self.addEventListener("message", (e: MessageEvent) => {
    // console.log("FROM RW", e);
    if (e.data && e.data.taskId) {
        const resolve = awaitingResolves.get(e.data.taskId);
        awaitingResolves.delete(e.data.taskId);
        resolve(e.data.result);
    }
});
