import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            fileName: "[name]",
            entry: "src/index.ts",
            formats: ["cjs", "es"],
        },
        rollupOptions: {
            output: {
                preserveModulesRoot: "src",
                preserveModules: true,
            },
            external: ["node:path", "node:process", /(through2|through2\/)/, /(rimraf|rimraf\/)/],
        },
    },
    plugins: [
        dts({
            staticImport: true,
            tsconfigPath: "./tsconfig.json",
            exclude: ["dist/**", "__build-src__/**", "vite.config.ts", "**/__tests__/**", "vitest.config.ts"],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
