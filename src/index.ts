import type { Plugin } from 'esbuild'
import fs from 'fs/promises';
import path from 'path';
import hasha  from 'hasha';

interface Options {
  filter?: RegExp
  dataUrl?: false
  file?: false
  fileName?: string
  publicPath?: string
  distPath?: string
}

export function ImageLoader(options: Options): Plugin {
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

        const distPath = options?.distPath ?? "/dist/";
        const fileNameTemplate = options?.fileName ?? '[name]-[hash][extname]';
        // '\\' 넣은 이유는 버그 build 결과물을 가져다 쓰는 곳에서 발생하는 path 문제를 해결하기 위함
        const publicPath = options?.publicPath !== '' ? '\\' + options.publicPath : '';
        const fileContent = await fs.readFile(args.path);
        const hash = await hasha(fileContent, { algorithm: "sha1" });
        const ext = path.extname(args.path);
        const base = path.basename(args.path, ext);

        // fileName template 치환
        const hashedName = fileNameTemplate
          .replace('[name]', base)
          .replace('[hash]', hash.slice(0, 16))
          .replace('[extname]', ext);

        // hashedName에서 경로 부분 생성
        const relativeFilePath = path.join(build.initialOptions.absWorkingDir ?? '', distPath, hashedName);
        
        // 파일 존재 여부 확인
        let alreadyExists = false;
        try {
          await fs.access(relativeFilePath);
          alreadyExists = true;
        } catch {
          alreadyExists = false;
        }

        // 파일이 없을 경우 복사
        if (!alreadyExists) {
          await fs.mkdir(path.dirname(relativeFilePath), { recursive: true });
          await fs.writeFile(relativeFilePath, fileContent);
        }
      
        return {
          contents: `' ${publicPath}${hashedName}'`,
          loader: "text"
        };
      })
    },
  }
}
