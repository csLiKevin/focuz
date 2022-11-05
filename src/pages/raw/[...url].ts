import { replaceRelativeUrls, getSourceURL, isTextContent } from "../../utils";
import type { APIContext, APIRoute } from "astro";

export const get: APIRoute = async function get(context: APIContext) {
    const source = getSourceURL(context);
    if (source) {
        try {
            const response = await fetch(source);
            const contentType = response.headers.get("content-type") || "";
            const headers = new Headers({
                "content-type": contentType,
                "cache-control": "public, max-age=300",
            });
            if (isTextContent(contentType)) {
                const text = await response.text();
                return new Response(replaceRelativeUrls(`raw/${source.origin}`, text), {
                    headers,
                });
            }
            headers.set("cache-control", "public, max-age=604800");
            return new Response(response.body, { headers });
        } catch (exception) {}
    }

    return new Response(undefined, { status: 500 });
};
