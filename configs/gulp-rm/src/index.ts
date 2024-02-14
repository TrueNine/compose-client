// @ts-nocheck
import path from "node:path";
import process from "node:process";

import through from "through2";
import { rimraf } from "rimraf";
import type { SafeAny } from "@compose/api-types";
import type * as File from "vinyl";

interface Options {
    force?: boolean;
    verbose?: boolean;
}

const a = (options?: Options): ((file: File) => string) => {
    if (!options) options = {};
    if (options.force) options.force = false;

    const del = (file: File, encoding: SafeAny, cb: SafeAny): string => {
        const cwd = file.cwd || process.cwd();
        const filepath = path.resolve(cwd, file.path);
        const relativeFromCwd = path.relative(cwd, filepath);
        if (relativeFromCwd === "") {
            this.emit("error", new Error("Cannot delete the current working directory: " + filepath));
            this.push(file);
            return cb();
        }

        if (!options?.force && relativeFromCwd.substring(0, 2) === "..") {
            this.emit("error", new Error("Cannot delete files or folders outside the current working directory: " + filepath));
            this.push(file);
            return cb();
        }

        if (options?.verbose) console.log("gulp-rimraf: removed " + filepath);

        const binded = function (err: SafeAny) {
            if (err) this.emit("error", err);
            this.push(file);
            cb();
        }.bind(this);

        rimraf(filepath, binded);
    };
    return through.obj(del);
};

export default a;
