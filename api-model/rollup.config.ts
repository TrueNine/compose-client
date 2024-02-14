import { defineConfig } from "rollup";
import ts from "@rollup/plugin-typescript";
import res from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import { emptyDirSync } from "fs-extra";

export default defineConfig([
    {
        input: "src/index.ts",
        plugins: [
            {
                name: "generate-types",
                buildStart: () => {
                    emptyDirSync("dist");
                },
            },
            res(),
            cjs(),
            ts({
                tsconfig: "./tsconfig.json",
                exclude: ["__tests__/**", "rollup.config.ts", "vite.config.ts", "vitest.config.ts", "dist"],
            }),
        ],
        output: [
            {
                sourcemap: true,
                entryFileNames: "[name].js",
                preserveModulesRoot: "src",
                preserveModules: true,
                format: "es",
                dir: "dist",
            },
            {
                sourcemap: true,
                entryFileNames: "[name].cjs",
                preserveModulesRoot: "src",
                preserveModules: true,
                format: "cjs",
                dir: "dist",
            },
        ],
        external: ["vue", "tsLib", "vue-router", /(@compose|@compose\/)/, "api-types", /(lodash|lodash\/)/, /(dayjs|dayjs\/)/],
    },
    {
        input: "src/index.ts",
        plugins: [
            res(),
            cjs(),
            ts({
                tsconfig: "./tsconfig.json",
                compilerOptions: {
                    declaration: true,
                    declarationMap: true,
                    emitDeclarationOnly: true,
                    declarationDir: "dist",
                },
                exclude: ["__tests__/**", "rollup.config.ts", "vite.config.ts", "vitest.config.ts", "dist"],
            }),
        ],
        output: [
            {
                dir: "dist",
            },
        ],
    },
]);
