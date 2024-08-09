import { homedir } from "os"

interface Iconfig {
    port: string | number;
    imagePath: string;
    cachePath: string;
    ssl: {
        key: string | undefined;
        cert: string | undefined;
    } | undefined;
};

export async function checkConfig(config: Iconfig) {
    if (typeof config.port !== "number" && typeof config.port !== "string") {
        throw new Error("PORT must be a valid number or string");
    }
    if (typeof config.imagePath !== "string") {
        throw new Error("IMAGE_PATH must be a valid string");
    }
    if (typeof config.cachePath !== "string") {
        throw new Error("CACHE_PATH must be a valid string");
    }
    if (config.ssl) {
        if (!await Bun.file(config.ssl.key as string).exists())
            throw new Error("SSL_KEY must point to a valid file");
        if (!await Bun.file(config.ssl.cert as string).exists())
            throw new Error("SSL_CERT must point to a valid file");
    }
}

const config: Iconfig = {
    port: process.env.PORT || 8000,
    imagePath: process.env.IMAGE_PATH || homedir() + "/Pictures",
    cachePath: process.env.CACH_PATH || homedir() + "/Pictures/cache",
    ssl: process.env.USE_SSL === "true" ? {
        key: process.env.SSL_KEY,
        cert: process.env.SSL_CERT
    } : undefined,
};

export default config