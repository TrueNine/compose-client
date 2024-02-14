import terser from "@rollup/plugin-terser";

import type { InternalConfig } from "@/CustomRollupConfig";

export function terserPlugin(enable: boolean, cfg: InternalConfig) {
    return enable
        ? terser({
              ...cfg.terserOption,
              ecma: 2020,
              compress: {
                  // eslint-disable-next-line camelcase
                  drop_console: cfg.terserDropLog,
                  // eslint-disable-next-line camelcase
                  drop_debugger: cfg.terserDropLog,
                  arguments: true,
                  module: true,
                  // eslint-disable-next-line camelcase
                  booleans_as_integers: true,
              },
          })
        : undefined;
}
