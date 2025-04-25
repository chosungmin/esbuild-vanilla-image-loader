import { Plugin } from 'esbuild';

interface Options {
    filter?: RegExp;
    dataUrl?: false;
    file?: false;
    fileName?: string;
    publicPath?: string;
    distPath?: string;
}
declare function ImageLoader(options: Options): Plugin;

export { ImageLoader };
