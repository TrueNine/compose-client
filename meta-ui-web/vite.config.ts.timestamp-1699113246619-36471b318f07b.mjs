// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+vite@4.5.0_@types+node@20.8.10_sass@1.69.5_terser@5.24.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.4.0_vite@4.5.0_vue@3.3.7/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-dts@3.6.3_@types+node@20.8.10_rollup@4.3.0_typescript@5.2.2_vite@4.5.0/node_modules/vite-plugin-dts/dist/index.mjs";
import vueJsx from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue-jsx@3.0.2_vite@4.5.0_vue@3.3.7/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+unplugin-auto-import@0.16.7_@vueuse+core@10.5.0_rollup@4.3.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.2_rollup@4.3.0_vue@3.3.7/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver, NaiveUiResolver, Vuetify3Resolver } from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.2_rollup@4.3.0_vue@3.3.7/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import unocss from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+unocss@0.57.2_postcss@8.4.31_rollup@4.3.0_vite@4.5.0/node_modules/unocss/dist/vite.mjs";
import ViteFonts from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+unplugin-fonts@1.0.3_vite@4.5.0/node_modules/unplugin-fonts/dist/vite.mjs";
import vuetify from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/registry.npmmirror.com+vite-plugin-vuetify@1.0.2_vite@4.5.0_vue@3.3.7_vuetify@3.3.23/node_modules/vite-plugin-vuetify/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/project/yan100/compose-client/meta-ui-web/vite.config.ts";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: "MetaUI",
      fileName: "[name]",
      entry: "index.ts",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: ".",
        preserveModules: true
      },
      external: [
        "vue",
        /(@vueuse|@vueuse\/)/,
        /(naive-ui|naive-ui\/)/,
        /(vuetify|vuetify\/)/,
        /(element-plus|element-plus\/)/,
        /\.(scss|sass|less|css)/,
        /(lodash-es|lodash-es\/)/,
        /(dayjs|dayjs\/)/,
        /(@compose|@compose\/)/
      ]
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    unocss(),
    dts({
      exclude: ["dist/**", "__build-src__/**", "vite.config.ts", "**/__test__/**", "vitest.config.ts", "playground"]
    }),
    vuetify({}),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
        },
        "pinia",
        "quasar",
        "vue-router",
        "vue-i18n",
        "@vueuse/core"
      ],
      dts: "unplugin-auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    }),
    Components({
      dts: "component-auto-imports.d.ts",
      deep: true,
      dirs: ".",
      resolvers: [ElementPlusResolver(), NaiveUiResolver(), Vuetify3Resolver()]
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900"
          }
        ]
      }
    })
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    port: 3e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXHlhbjEwMFxcXFxjb21wb3NlLWNsaWVudFxcXFxtZXRhLXVpLXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFx5YW4xMDBcXFxcY29tcG9zZS1jbGllbnRcXFxcbWV0YS11aS13ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QveWFuMTAwL2NvbXBvc2UtY2xpZW50L21ldGEtdWktd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBVUkx9IGZyb20gJ25vZGU6dXJsJ1xuXG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7RWxlbWVudFBsdXNSZXNvbHZlciwgTmFpdmVVaVJlc29sdmVyLCBWdWV0aWZ5M1Jlc29sdmVyfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgdW5vY3NzIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IFZpdGVGb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xuaW1wb3J0IHZ1ZXRpZnkgZnJvbSAndml0ZS1wbHVnaW4tdnVldGlmeSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgbGliOiB7XG4gICAgICBuYW1lOiAnTWV0YVVJJyxcbiAgICAgIGZpbGVOYW1lOiAnW25hbWVdJyxcbiAgICAgIGVudHJ5OiAnaW5kZXgudHMnLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnXVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIHByZXNlcnZlTW9kdWxlc1Jvb3Q6ICcuJyxcbiAgICAgICAgcHJlc2VydmVNb2R1bGVzOiB0cnVlXG4gICAgICB9LFxuICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgIC8oQHZ1ZXVzZXxAdnVldXNlXFwvKS8sXG4gICAgICAgIC8obmFpdmUtdWl8bmFpdmUtdWlcXC8pLyxcbiAgICAgICAgLyh2dWV0aWZ5fHZ1ZXRpZnlcXC8pLyxcbiAgICAgICAgLyhlbGVtZW50LXBsdXN8ZWxlbWVudC1wbHVzXFwvKS8sXG4gICAgICAgIC9cXC4oc2Nzc3xzYXNzfGxlc3N8Y3NzKS8sXG4gICAgICAgIC8obG9kYXNoLWVzfGxvZGFzaC1lc1xcLykvLFxuICAgICAgICAvKGRheWpzfGRheWpzXFwvKS8sXG4gICAgICAgIC8oQGNvbXBvc2V8QGNvbXBvc2VcXC8pL1xuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIHVub2NzcygpLFxuICAgIGR0cyh7XG4gICAgICBleGNsdWRlOiBbJ2Rpc3QvKionLCAnX19idWlsZC1zcmNfXy8qKicsICd2aXRlLmNvbmZpZy50cycsICcqKi9fX3Rlc3RfXy8qKicsICd2aXRlc3QuY29uZmlnLnRzJywgJ3BsYXlncm91bmQnXVxuICAgIH0pLFxuICAgIHZ1ZXRpZnkoe30pLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAge1xuICAgICAgICAgICduYWl2ZS11aSc6IFsndXNlRGlhbG9nJywgJ3VzZU1lc3NhZ2UnLCAndXNlTm90aWZpY2F0aW9uJywgJ3VzZUxvYWRpbmdCYXInXVxuICAgICAgICB9LFxuICAgICAgICAncGluaWEnLFxuICAgICAgICAncXVhc2FyJyxcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAndnVlLWkxOG4nLFxuICAgICAgICAnQHZ1ZXVzZS9jb3JlJ1xuICAgICAgXSxcbiAgICAgIGR0czogJ3VucGx1Z2luLWF1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGVzbGludHJjOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsXG4gICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWVcbiAgICAgIH1cbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGR0czogJ2NvbXBvbmVudC1hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICBkZWVwOiB0cnVlLFxuICAgICAgZGlyczogJy4nLFxuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpLCBOYWl2ZVVpUmVzb2x2ZXIoKSwgVnVldGlmeTNSZXNvbHZlcigpXVxuICAgIH0pLFxuICAgIFZpdGVGb250cyh7XG4gICAgICBnb29nbGU6IHtcbiAgICAgICAgZmFtaWxpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUm9ib3RvJyxcbiAgICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgZGVmaW5lOiB7J3Byb2Nlc3MuZW52Jzoge319LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdVLFNBQVEsZUFBZSxXQUFVO0FBRWpXLFNBQVEsb0JBQW1CO0FBQzNCLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEscUJBQXFCLGlCQUFpQix3QkFBdUI7QUFDckUsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZUFBZTtBQUN0QixPQUFPLGFBQWE7QUFYcUwsSUFBTSwyQ0FBMkM7QUFhMVAsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3ZCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixxQkFBcUI7QUFBQSxRQUNyQixpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0YsU0FBUyxDQUFDLFdBQVcsb0JBQW9CLGtCQUFrQixrQkFBa0Isb0JBQW9CLFlBQVk7QUFBQSxJQUMvRyxDQUFDO0FBQUEsSUFDRCxRQUFRLENBQUMsQ0FBQztBQUFBLElBQ1YsV0FBVztBQUFBLE1BQ1QsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZLENBQUMsYUFBYSxjQUFjLG1CQUFtQixlQUFlO0FBQUEsUUFDNUU7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFVBQVU7QUFBQSxRQUNWLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixXQUFXLENBQUMsb0JBQW9CLEdBQUcsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUM7QUFBQSxJQUMxRSxDQUFDO0FBQUEsSUFDRCxVQUFVO0FBQUEsTUFDUixRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsVUFDUjtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sUUFBUTtBQUFBLFVBQ1Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVEsRUFBQyxlQUFlLENBQUMsRUFBQztBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
