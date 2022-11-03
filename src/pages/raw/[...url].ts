import { fixRelativeUrls, getSourceURL } from "../../utils";
import type { APIContext, APIRoute } from "astro";

export const get: APIRoute = async function get(context: APIContext) {
    const source = getSourceURL(context);
    if (source) {
        try {
            const response = await fetch(source);
            const contentType = response.headers.get("content-type") || "";
            const headers = new Headers({ "content-type": contentType });
            if (contentType.includes("text")) {
                const text = await response.text();
                return new Response(fixRelativeUrls(`raw/${source}`, text), {
                    headers,
                });
            }
            return new Response(response.body, { headers });
        } catch (exception) {}
    }

    return new Response(undefined, { status: 500 });
};
