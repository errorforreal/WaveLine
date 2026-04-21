const z = require('zod');

const validateUrl = z.object({
    wsUrl : z
        .url("Invalid Url")
        .refine((url)=>{
            if (!URL.canParse(url)) return false;

            const parsed = new URL(url);
            return parsed.protocol === "ws:" || parsed.protocol === "wss:";
        }, {
            message : "Only ws:// or wss:// URLs are allowed"
        })
        .refine((url)=>{
            if (!URL.canParse(url)) return false;

            const hostname = new URL(url).hostname;
            return !(
                // hostname === "localhost" ||
                hostname.startsWith("127.") ||
                hostname.startsWith("192.168.") ||
                hostname.startsWith("10.")
            )
        }, {
            message : "Private/internal Urls not allowed"
        })
})

module.exports = validateUrl;