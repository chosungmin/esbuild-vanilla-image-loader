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
        const distPath = options?.distPath ?? "/dist/";
        const fileNameTemplate = options?.fileName ?? "[name]-[hash][extname]";
        const publicPath = options?.publicPath !== "" ? "\\" + options.publicPath : "";
        const fileContent = await fs.readFile(args.path);
        const hash = await hasha(fileContent, { algorithm: "sha1" });
        const ext = path.extname(args.path);
        const base = path.basename(args.path, ext);
        const hashedName = fileNameTemplate.replace("[name]", base).replace("[hash]", hash.slice(0, 16)).replace("[extname]", ext);
        const relativeFilePath = path.join(build.initialOptions.absWorkingDir ?? "", distPath, hashedName);
        let alreadyExists = false;
        try {
          await fs.access(relativeFilePath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }
        if (!alreadyExists) {
          await fs.mkdir(path.dirname(relativeFilePath), { recursive: true });
          await fs.writeFile(relativeFilePath, fileContent);
        }
        return {
          contents: `' ${publicPath}${hashedName}'`,
          loader: "text"
        };
      });
    }
  };
}
export {
  ImageLoader
};
