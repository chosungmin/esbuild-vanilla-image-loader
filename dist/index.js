"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ImageLoader: () => ImageLoader
});
module.exports = __toCommonJS(index_exports);
var import_promises = __toESM(require("fs/promises"));
var import_path = __toESM(require("path"));
var import_hasha = __toESM(require("hasha"));
function ImageLoader(options) {
  return {
    name: "esbuild-vanilla-image-loader",
    setup(build) {
      build.onLoad({
        filter: options?.filter ?? /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/
      }, async (args) => {
        if (options?.dataUrl) {
          return {
            contents: await import_promises.default.readFile(args.path),
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
        const fileContent = await import_promises.default.readFile(args.path);
        const hash = await (0, import_hasha.default)(fileContent, { algorithm: "sha1" });
        const ext = import_path.default.extname(args.path);
        const base = import_path.default.basename(args.path, ext);
        const hashedName = fileNameTemplate.replace("[name]", base).replace("[hash]", hash.slice(0, 16)).replace("[extname]", ext);
        const relativeFilePath = import_path.default.join(build.initialOptions.absWorkingDir ?? "", distPath, hashedName);
        let alreadyExists = false;
        try {
          await import_promises.default.access(relativeFilePath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }
        if (!alreadyExists) {
          await import_promises.default.mkdir(import_path.default.dirname(relativeFilePath), { recursive: true });
          await import_promises.default.writeFile(relativeFilePath, fileContent);
        }
        return {
          contents: `${publicPath}${hashedName}`,
          loader: "text"
        };
      });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImageLoader
});
