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

export function fixRelativeUrls(baseUrl: string, text: string) {
    return text.replace(/(href|src)=('|")\//gi, `$1=$2/${baseUrl}/`);
}

export type ParseResults = Readonly<{
    html?: ReturnType<Readability["parse"]>;
    raw?: string;
    xml?: Feed;
}>;
export async function parse(url: URL): Promise<ParseResults> {
    const response = await fetch(url.toString());
    const text = fixRelativeUrls(url.origin, await response.text());
    const isXML = Boolean(
        response.headers.get("content-type")?.match(/(application|text)\/xml/gi)
    );

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
