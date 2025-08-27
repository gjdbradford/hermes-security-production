// vite.config.ts
import { defineConfig } from "file:///Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main";
var vite_config_default = defineConfig(({ mode }) => ({
  base: mode === "production" ? "/hermes-security-production/" : "/",
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Performance optimizations
    target: "es2017",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production"
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible", "@radix-ui/react-context-menu", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-hover-card", "@radix-ui/react-label", "@radix-ui/react-menubar", "@radix-ui/react-navigation-menu", "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-radio-group", "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-slot", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast", "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip"],
          icons: ["lucide-react"],
          utils: ["clsx", "tailwind-merge", "class-variance-authority"]
        }
      }
    },
    // Asset optimization
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1e3
  },
  // Development optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ2JyYWRmb3JkL0Rlc2t0b3AvQ3Vyc29yL0hlcm1lcy9oZXJtZXMtY29weWNyYWZ0LW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9nYnJhZGZvcmQvRGVza3RvcC9DdXJzb3IvSGVybWVzL2hlcm1lcy1jb3B5Y3JhZnQtbWFpbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ2JyYWRmb3JkL0Rlc2t0b3AvQ3Vyc29yL0hlcm1lcy9oZXJtZXMtY29weWNyYWZ0LW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIGJhc2U6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICcvaGVybWVzLXNlY3VyaXR5LXByb2R1Y3Rpb24vJyA6ICcvJyxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBQZXJmb3JtYW5jZSBvcHRpbWl6YXRpb25zXG4gICAgdGFyZ2V0OiAnZXMyMDE3JyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBtb2RlID09PSAncHJvZHVjdGlvbicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIHVpOiBbJ0ByYWRpeC11aS9yZWFjdC1hY2NvcmRpb24nLCAnQHJhZGl4LXVpL3JlYWN0LWFsZXJ0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3QtYXNwZWN0LXJhdGlvJywgJ0ByYWRpeC11aS9yZWFjdC1hdmF0YXInLCAnQHJhZGl4LXVpL3JlYWN0LWNoZWNrYm94JywgJ0ByYWRpeC11aS9yZWFjdC1jb2xsYXBzaWJsZScsICdAcmFkaXgtdWkvcmVhY3QtY29udGV4dC1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLCAnQHJhZGl4LXVpL3JlYWN0LWhvdmVyLWNhcmQnLCAnQHJhZGl4LXVpL3JlYWN0LWxhYmVsJywgJ0ByYWRpeC11aS9yZWFjdC1tZW51YmFyJywgJ0ByYWRpeC11aS9yZWFjdC1uYXZpZ2F0aW9uLW1lbnUnLCAnQHJhZGl4LXVpL3JlYWN0LXBvcG92ZXInLCAnQHJhZGl4LXVpL3JlYWN0LXByb2dyZXNzJywgJ0ByYWRpeC11aS9yZWFjdC1yYWRpby1ncm91cCcsICdAcmFkaXgtdWkvcmVhY3Qtc2Nyb2xsLWFyZWEnLCAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsICdAcmFkaXgtdWkvcmVhY3Qtc2VwYXJhdG9yJywgJ0ByYWRpeC11aS9yZWFjdC1zbGlkZXInLCAnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLCAnQHJhZGl4LXVpL3JlYWN0LXN3aXRjaCcsICdAcmFkaXgtdWkvcmVhY3QtdGFicycsICdAcmFkaXgtdWkvcmVhY3QtdG9hc3QnLCAnQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZScsICdAcmFkaXgtdWkvcmVhY3QtdG9nZ2xlLWdyb3VwJywgJ0ByYWRpeC11aS9yZWFjdC10b29sdGlwJ10sXG4gICAgICAgICAgaWNvbnM6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgICAgdXRpbHM6IFsnY2xzeCcsICd0YWlsd2luZC1tZXJnZScsICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBBc3NldCBvcHRpbWl6YXRpb25cbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NixcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gIH0sXG4gIC8vIERldmVsb3BtZW50IG9wdGltaXphdGlvbnNcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVyxTQUFTLG9CQUFvQjtBQUNuWSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsTUFBTSxTQUFTLGVBQWUsaUNBQWlDO0FBQUEsRUFDL0QsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWMsU0FBUztBQUFBLFFBQ3ZCLGVBQWUsU0FBUztBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixJQUFJLENBQUMsNkJBQTZCLGdDQUFnQyxnQ0FBZ0MsMEJBQTBCLDRCQUE0QiwrQkFBK0IsZ0NBQWdDLDBCQUEwQixpQ0FBaUMsOEJBQThCLHlCQUF5QiwyQkFBMkIsbUNBQW1DLDJCQUEyQiw0QkFBNEIsK0JBQStCLCtCQUErQiwwQkFBMEIsNkJBQTZCLDBCQUEwQix3QkFBd0IsMEJBQTBCLHdCQUF3Qix5QkFBeUIsMEJBQTBCLGdDQUFnQyx5QkFBeUI7QUFBQSxVQUNud0IsT0FBTyxDQUFDLGNBQWM7QUFBQSxVQUN0QixPQUFPLENBQUMsUUFBUSxrQkFBa0IsMEJBQTBCO0FBQUEsUUFDOUQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxtQkFBbUI7QUFBQSxJQUNuQix1QkFBdUI7QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLEVBQ3BEO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
