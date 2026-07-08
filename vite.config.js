import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        work: resolve(__dirname, "work.html"),
        project: resolve(__dirname, "project.html"),
        log01: resolve(__dirname, "log01.html"),
        yoahorro: resolve(__dirname, "yoahorro.html"),
        li4uid: resolve(__dirname, "li4uid.html"),
        puente: resolve(__dirname, "puente-de-equidad.html"),
        synapsis: resolve(__dirname, "synapsis-academy.html"),
        contact: resolve(__dirname, "contact.html"),
        cinecasero: resolve(__dirname, "cinecasero.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
