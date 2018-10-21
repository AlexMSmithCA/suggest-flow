const fs = require('fs');
const proc = require('child_process');
const util = require('util');
const path = require('path');

const tmp = require('tmp');

const exec = util.promisify(proc.exec);
const tmpName = util.promisify(tmp.tmpName);

async function suggestFlow(testPath) {
  const isFile = fs.statSync(testPath).isFile();

  if(isFile) {
    if(!testPath.endsWith('.js')) return;

    const relativePath = path.relative(process.cwd(), testPath);
    console.log(`Converting ${relativePath}`);

    const tmpFilename = await tmpName();

    const convertToFlowTypesCmd = `
      cd ${path.dirname(testPath)} &&
      flow suggest ${testPath} > ${tmpFilename} &&
      rm -rf ${testPath} &&
      cp ${tmpFilename} ${testPath} &&
      rm -rf ${tmpFilename} &&
      prettier-eslint --write ${testPath}`;
    const result = await exec(convertToFlowTypesCmd, {
      cwd: process.cwd(),
    });
  } else {
    const files = fs.readdirSync(testPath);
    for(let i = 0; i < files.length; i++) {
      const filePath = `${testPath}/${files[i]}`;
      await suggestFlow(filePath);
    }
  }
};

async function run(path) {
  const isDirectory = fs.statSync(path).isDirectory();
  if(isDirectory) {
    const installDepsCmd = `
      cd ${path} &&
      yarn install`;
    const result = await exec(installDepsCmd, {
      cwd: process.cwd(),
    });
  }

  await suggestFlow(path);
};

run(process.argv[2]);
