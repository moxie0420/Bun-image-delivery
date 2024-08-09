import jimp from "jimp"

console.log("starting up!")

let imagePath = process.env.IMAGE_PATH;

if (imagePath === undefined || imagePath === "") {
    imagePath = "."
}

const PORT = process.env.PORT || 8000;

async function tranformImage(width: number, height: number, path: string) {
    const cached = imagePath + path.substring(0, path.length - 4) + "_" + width + "_" + height + path.substring(path.length - 4);
    
    if (await Bun.file(cached).exists()) {
        const cachedImage = Bun.file(cached);
        return cachedImage
    } else {
        console.log("Couldnt find cached Image, making a new one");
        const resized = (await jimp.read("." + path)).resize(width, height);

        await resized.writeAsync(cached);
        return Bun.file(cached);
    }
}

async function fetchImage(path: string) {
    if (path === "/") {
        return "Please Specify A File"
    } else {
        if (await Bun.file(imagePath + path).exists()) return Bun.file(imagePath + path);
        else {
            return "Image not Found :("
        }
    }
}

Bun.serve({
    port: PORT,
    async fetch(request) {
        const url_o = new URL(request.url);

        const path = url_o.pathname;
        const params = url_o.searchParams;

        let image;
        if (params.size > 0) {
            let w, h;

            if (params.has("w")) w = parseInt(params.get("w") as string);
            if (params.has("h")) h = parseInt(params.get("h") as string);

            image = await tranformImage(w || jimp.AUTO, h || jimp.AUTO, path)
        } else {
            image = await fetchImage(url_o.pathname);
        }

        return new Response(image);
    },
})

console.log("opened server on port " + PORT)