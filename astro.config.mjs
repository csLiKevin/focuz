import image from "@astrojs/image";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

export default defineConfig({
    output: "server",
    adapter: vercel(),
    integrations: [image(), tailwind()],
});
