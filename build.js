import { createBundle } from 'dts-buddy';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf-8'));

async function dts() {
  for (const name of ['collect', 'define', 'event', 'is', 'math', 'string', 'to', 'type']) {
    fs.writeFileSync(`${dir}/${name}.d.ts`, `import './type/index.js';`);
  }
  fs.writeFileSync(`${dir}/index.d.ts`, `import './type/index.js';`);
}

async function types() {
  await createBundle({
    project: 'jsconfig.json',
    output: `${dir}/type/index.d.ts`,
    compilerOptions: {
      strict: true,
    },
    modules: {
      [pkg.name]: `${dir}/src/index.js`,
      [`${pkg.name}/collect`]: `${dir}/src/collect.js`,
      [`${pkg.name}/define`]: `${dir}/src/define.js`,
      [`${pkg.name}/event`]: `${dir}/src/event.js`,
      [`${pkg.name}/is`]: `${dir}/src/is.js`,
      [`${pkg.name}/math`]: `${dir}/src/math.js`,
      [`${pkg.name}/string`]: `${dir}/src/string.js`,
      [`${pkg.name}/to`]: `${dir}/src/to.js`,
      [`${pkg.name}/type`]: `${dir}/src/type.ts`,
    },
  });
}

(async () => {
  await dts();
  await types();
})();
