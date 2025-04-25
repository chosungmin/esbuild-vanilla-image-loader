import { Plugin } from 'esbuild';

interface Options {
    filter?: RegExp;
    dataUrl?: false;
    file?: false;
    outputPath?: string;
}
declare function ImageLoader(options: Options): Plugin;

export { ImageLoader };
