import { resolve } from "node:path";
import { spawn } from "node:child_process";

import { dest, parallel, series, src } from "gulp";
import gulpSass from "gulp-sass";
import sass from "sass";
import gulpPostcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import unocssPostcss from "@unocss/postcss";
import { rimraf } from "rimraf";

export const basePath = joinPath("..");
export const distPath = joinPath("../dist");
export const nodeModulesPath = joinPath("../node_modules");
console.log(distPath);

export async function buildUnocss(fName = "unocss.css") {
    await run(`unocss "${basePath}/**/*" -c ${basePath}/unocss.config.ts -o ${distPath}/${fName} -m`, basePath);
}

export const buildStyle = () => {
    return src(`${basePath}/**/**.scss`)
        .pipe(
            gulpSass(sass)({
                includePaths: [nodeModulesPath],
            }),
        )
        .pipe(gulpPostcss([unocssPostcss(), autoprefixer(), cssnano()]))
        .pipe(dest(distPath));
};
export const moveBuildStyle = () => {
    return src(`${distPath}/src/**/**`).pipe(dest(distPath));
};

export const deleteBuildStyle = () => {
    return rimraf(`${distPath}/src`);
};

export default series(
    parallel(
        async () => buildStyle(),
        async () => buildUnocss(),
    ),
    series(
        () => moveBuildStyle(),
        () => deleteBuildStyle(),
    ),
) as unknown;

export function joinPath(pattern: string): string {
    return resolve(__dirname, pattern).replaceAll("\\", "/");
}

export const run = async (command: string, path: string) => {
    const [cmd, ...args] = command.split(" ");
    return new Promise((resolve) => {
        const app = spawn(cmd, args, {
            cwd: path,
            stdio: "inherit",
            shell: true,
        });
        app.on("close", resolve);
    });
};
