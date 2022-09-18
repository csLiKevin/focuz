import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: vercel(),
    integrations: [image(), prefetch()],
});
