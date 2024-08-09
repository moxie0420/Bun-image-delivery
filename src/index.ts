import { tranformImage, fetchImage } from "./images"
import config, { checkConfig } from "./config";

console.log("starting up!")

await checkConfig(config);

Bun.serve({
    port: config.port,
    tls: config.ssl,
    async fetch(request) {
        const url_o = new URL(request.url);

        const path = url_o.pathname;
        const params = url_o.searchParams;

        let image;
        if (params.size > 0) {
            let w, h;

            if (params.has("w")) w = parseInt(params.get("w") as string);
            if (params.has("h")) h = parseInt(params.get("h") as string);

            image = await tranformImage(path, w, h)
        } else {
            image = await fetchImage(url_o.pathname);
        }

        return new Response(image);
    },
})

console.log("opened server on port " + config.port)