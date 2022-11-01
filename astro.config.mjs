import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";
import image from "@astrojs/image";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
    output: "server",
    adapter: vercel(),
    integrations: [image(), tailwind()],
});
