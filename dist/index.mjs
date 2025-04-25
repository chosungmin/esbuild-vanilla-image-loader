// src/index.ts
import fs from "fs/promises";
import path from "path";
import hasha from "hasha";
function ImageLoader(options) {
  return {
    name: "esbuild-vanilla-image-loader",
    setup(build) {
      build.onLoad({
        filter: options?.filter ?? /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/
      }, async (args) => {
        if (options?.dataUrl) {
          return {
            contents: await fs.readFile(args.path),
            loader: "dataurl"
          };
        }
        if (options?.file) {
          return {
            contents: `
            const file = '${args.path.replace(build.initialOptions.absWorkingDir, "")}';
            export default file;`,
            loader: "js"
          };
        }
        const outputPath = options?.outputPath ?? "dist/assets";
        const fileContent = await fs.readFile(args.path);
        const hash = await hasha(fileContent, { algorithm: "sha1" });
        const ext = path.extname(args.path);
        const base = path.basename(args.path, ext);
        const hashedName = `${base}-${hash.slice(0, 16)}${ext}`;
        const outPath = path.resolve(outputPath, hashedName);
        let alreadyExists = false;
        try {
          await fs.access(outPath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }
        if (!alreadyExists) {
          await fs.mkdir(path.dirname(outPath), { recursive: true });
          await fs.writeFile(outPath, fileContent);
        }
        return {
          contents: `/assets/${hashedName}`,
          loader: "text"
        };
      });
    }
  };
}
export {
  ImageLoader
};
