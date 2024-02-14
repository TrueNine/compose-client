import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        minify: "esbuild",
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
            external: ["eslint-define-config", "@rushstack/eslint-patch/modern-module-resolution", "@typescript-eslint/parser"],
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
