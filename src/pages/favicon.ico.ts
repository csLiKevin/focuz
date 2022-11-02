import type { APIContext, APIRoute } from "astro";

// Alias for favicon.svg; browsers automatically request favicon.ico.
export const get: APIRoute = async function get(context: APIContext) {
    return context.redirect("/favicon.svg", 301);
};
