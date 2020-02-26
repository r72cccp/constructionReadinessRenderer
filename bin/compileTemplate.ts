import * as fs from 'fs';
import * as path from 'path';
import { default as minifyCssString } from 'minify-css-string';


const resolvePath = (filePath: string): Array<string> => {
  const filePathItems: Array<string> = filePath.split(/[\\/]/);
  const fileName = filePathItems.pop();
  const pathName = filePathItems.join('/');
  return [pathName, fileName];
};

const readFile = (filePath: string, callback?: (contents: string) => string): Promise<string> => {
  const [pathName, fileName] = resolvePath(filePath);

  return new Promise<string>((resolve) => {
    fs.readFile(`${path.resolve(__dirname, pathName)}/${fileName}`, 'utf8', (err, contents) => {
      if (err) {
        console.log('Ошибка!: ', err);
        return;
      };
      if (callback) {
        resolve(callback(contents));
      } else {
        resolve(contents);
      }
    });
  });
};

const writeFile = (filePath: string, content: string): void => {
  const [pathName, fileName] = resolvePath(filePath);
  fs.writeFile(`${path.resolve(__dirname, pathName)}/${fileName}`, content, (err) => {
    if (err) {
      console.log('#34', { err });
    };
  });
};

// Чтение json
const readJson = (): Promise<string> => {
  return readFile('../src/build/sampleData.json', (contents) => JSON.stringify(JSON.parse(contents)));
};

const readCss = (): Promise<string> => {
  return readFile('../dist/css/scene.css', (contents) => minifyCssString(contents));
};

const readBundleJs = (): Promise<string> => {
  return readFile('../dist/js/bundle.js', (contents) => minifyCssString(contents));
};

const readIndex = (): Promise<string> => {
  return readFile('../src/build/indexTemplate.html');
};

const promiseReads = [readJson(), readCss(), readBundleJs(), readIndex()];
Promise.all(promiseReads).then(([jsonText, cssText, bundleJsText, indexText]) => {
  const indexHtmlText = indexText.replace('{jsonAnchor}', jsonText);
  writeFile('../index.html', indexHtmlText);
  const indexHtmlTextFor1C = indexText
    .replace(/<link id="cssLink".+?\/>/, `<style>${cssText}</style>`)
    .replace(/<script id="jsScript".+?<\/script>/, `<script>${bundleJsText}</script>`);
    writeFile('../index1C.html', indexHtmlTextFor1C);
  });