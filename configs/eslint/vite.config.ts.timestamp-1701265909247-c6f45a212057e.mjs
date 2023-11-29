// vite.config.ts
import { defineConfig } from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/vite@5.0.4_@types+node@20.10.0_sass@1.69.5_terser@5.24.0/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/project/yan100/compose-client/node_modules/.pnpm/vite-plugin-dts@3.6.3_@types+node@20.10.0_rollup@4.6.0_typescript@5.3.2_vite@5.0.4/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    minify: "esbuild",
    sourcemap: true,
    lib: {
      fileName: "[name]",
      entry: "index.ts",
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: ".",
        preserveModules: true
      },
      external: ["eslint-define-config", "@rushstack/eslint-patch/modern-module-resolution", "@typescript-eslint/parser"]
    }
  },
  plugins: [
    dts({
      staticImport: true,
      tsconfigPath: "./tsconfig.json",
      exclude: ["dist/**", "__build-src__/**", "vite.config.ts", "**/__test__/**", "vitest.config.ts"]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxwcm9qZWN0XFxcXHlhbjEwMFxcXFxjb21wb3NlLWNsaWVudFxcXFxjb25maWdzXFxcXGVzbGludFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxccHJvamVjdFxcXFx5YW4xMDBcXFxcY29tcG9zZS1jbGllbnRcXFxcY29uZmlnc1xcXFxlc2xpbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3Byb2plY3QveWFuMTAwL2NvbXBvc2UtY2xpZW50L2NvbmZpZ3MvZXNsaW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgbGliOiB7XG4gICAgICBmaWxlTmFtZTogJ1tuYW1lXScsXG4gICAgICBlbnRyeTogJ2luZGV4LnRzJyxcbiAgICAgIGZvcm1hdHM6IFsnY2pzJywgJ2VzJ11cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXNSb290OiAnLicsXG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGV4dGVybmFsOiBbJ2VzbGludC1kZWZpbmUtY29uZmlnJywgJ0BydXNoc3RhY2svZXNsaW50LXBhdGNoL21vZGVybi1tb2R1bGUtcmVzb2x1dGlvbicsICdAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyJ11cbiAgICB9XG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBkdHMoe1xuICAgICAgc3RhdGljSW1wb3J0OiB0cnVlLFxuICAgICAgdHNjb25maWdQYXRoOiAnLi90c2NvbmZpZy5qc29uJyxcbiAgICAgIGV4Y2x1ZGU6IFsnZGlzdC8qKicsICdfX2J1aWxkLXNyY19fLyoqJywgJ3ZpdGUuY29uZmlnLnRzJywgJyoqL19fdGVzdF9fLyoqJywgJ3ZpdGVzdC5jb25maWcudHMnXVxuICAgIH0pXG4gIF1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJVLFNBQVEsb0JBQW1CO0FBQ3RXLE9BQU8sU0FBUztBQUVoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUEsTUFDSCxVQUFVO0FBQUEsTUFDVixPQUFPO0FBQUEsTUFDUCxTQUFTLENBQUMsT0FBTyxJQUFJO0FBQUEsSUFDdkI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLHFCQUFxQjtBQUFBLFFBQ3JCLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsTUFDQSxVQUFVLENBQUMsd0JBQXdCLG9EQUFvRCwyQkFBMkI7QUFBQSxJQUNwSDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLGNBQWM7QUFBQSxNQUNkLGNBQWM7QUFBQSxNQUNkLFNBQVMsQ0FBQyxXQUFXLG9CQUFvQixrQkFBa0Isa0JBQWtCLGtCQUFrQjtBQUFBLElBQ2pHLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
