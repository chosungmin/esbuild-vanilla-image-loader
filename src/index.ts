import type { Plugin } from 'esbuild'
import fs from 'fs/promises';
import path from 'path';
import hasha  from 'hasha';

interface Options {
  filter?: RegExp
  dataUrl?: false
  file?: false
  outputPath?: string
}

export function ImageLoader({outputPath='dist/assets', ...options}: Options): Plugin {
  return {
    name: 'esbuild-vanilla-image-loader',
    setup(build) {
      build.onLoad({
        filter: options?.filter ?? /\.(gif|jpe?g|tiff?|png|webp|bmp|svg)$/,
      }, async (args) => {
        if (options?.dataUrl) {
          return {
            contents: await fs.readFile(args.path),
            loader: 'dataurl',
          }
        }

        if (options?.file) {
          return {
            contents: `
            const file = '${args.path.replace(build.initialOptions.absWorkingDir!, '')}';
            export default file;`,
            loader: 'js',
          }
        }

        const fileContent =  await fs.readFile(args.path);

        // 1. 해시 계산
        const hash = await hasha(fileContent, { algorithm: 'sha1' });
        const ext = path.extname(args.path);
        const base = path.basename(args.path, ext);
        const hashedName = `${base}-${hash.slice(0, 16)}${ext}`;

        const outPath = path.resolve(outputPath, hashedName);
        
        // 2. 파일 존재 여부 확인
        let alreadyExists = false;
        try {
          await fs.access(outPath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }

        // 3. 파일이 없을 경우 복사
        if (!alreadyExists) {
          await fs.mkdir(path.dirname(outPath), { recursive: true });
          await fs.writeFile(outPath, fileContent);
        }
      
        return {
          contents: `/assets/${hashedName}`,
          loader: "text"
        };
      })
    },
  }
}
