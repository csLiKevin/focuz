import type { Feed } from "./env";
import { Readability } from "@mozilla/readability";
import type { APIContext, AstroGlobal } from "astro";
import { parseHTML } from "linkedom";
import Parser from "rss-parser";

export function getSourceURL(astro: APIContext | AstroGlobal) {
    const url = `${astro.params.url}${astro.url.search}`;

    if (url.indexOf(".") === -1) {
        return null;
    }

    try {
        return new URL(url);
    } catch (_) {}

    try {
        return new URL(`${astro.url.protocol}//${url}`);
    } catch (_) {}

    return null;
}

export function replaceRelativeUrls(baseUrl: string, text: string) {
    return text.replace(/(action|href|src)=('|")\//gi, `$1=$2/${baseUrl}/`);
}

export function isTextContent(contentType: string | null) {
    return contentType?.includes("text") || contentType?.includes("xml");
}

function isStaticUrl(url: URL) {
    return Boolean(url.toString().match(/.(css|gif|jpe?g|js|png)$/i));
}

export type ParseResults = Readonly<{
    html?: ReturnType<Readability["parse"]>;
    raw?: string;
    xml?: Feed;
}>;
export async function parse(url: URL): Promise<ParseResults> {
    if (isStaticUrl(url)) {
        return {};
    }

    const response = await fetch(url.toString());
    const contentType = response.headers.get("content-type");

    if (!isTextContent(contentType)) {
        return {};
    }

    const text = replaceRelativeUrls(url.origin, await response.text());
    const isXML = contentType?.includes("xml");

    if (isXML) {
        const parser = new Parser<Feed>({
            customFields: {
                item: ["description", "media:thumbnail"],
            },
        });
        return {
            xml: await parser.parseString(text),
        };
    }

    // TODO: Switch to JSDom to simulate a JS enabled browser.
    const { document } = parseHTML(text);
    return {
        html: new Readability(document).parse(),
    };
}
