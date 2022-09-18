/// <reference types="astro/client" />

import type { Item, Output } from "rss-parser";

type FeedItem = Item & {
	author?: string;
	"content:encoded"?: string;
	"content:encodedSnippet"?: string;
	description?: string;
	isoDate?: string;
	"media:thumbnail"?: {$: {url: string;}};
};
type Feed = Output<FeedItem> & {
	copyright?: string;
	language?: string;
	lastBuildDate?: string;
	pubDate?: string;
};
