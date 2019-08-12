// @flow

/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
const proc = require('child_process');
const util = require('util');
const pathModule = require('path');
const process = require('process');

const flow = require('flow-bin');
const prettier = require('prettier-eslint');

const exec = util.promisify(proc.exec);
const execFile = util.promisify(proc.execFile);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function suggestFlow(path, verbose = false) {
  const contents = (await execFile(flow, ['suggest', path], {
    cwd: process.cwd(),
  })).stdout;

  await writeFile(path, contents);
}

async function applyPrettier(path, verbose = false) {
  const contents = await readFile(path, 'utf-8');
  const formatted = prettier({
    text: contents,
    filePath: path,
  });

  await writeFile(path, formatted);
}

async function yarnInstall(path, verbose = false) {
  const installDepsCmd = `
    cd ${path} &&
    yarn install`;
  await exec(installDepsCmd, {
    cwd: process.cwd(),
  });
}

async function updateWithFlow(testPath, verbose = false) {
  const isFile = fs.statSync(testPath).isFile();

  if (isFile) {
    if (!testPath.endsWith('.js')) return;

    const relativePath = pathModule.relative(process.cwd(), testPath);
    if (verbose) console.log(`Converting ${relativePath}`);

    await suggestFlow(testPath);
    await applyPrettier(testPath);
  } else {
    const files = fs.readdirSync(testPath);
    for (let i = 0; i < files.length; i++) {
      const filePath = `${testPath}/${files[i]}`;
      await updateWithFlow(filePath, verbose);
    }
  }
}

async function run(path) {
  const isDirectory = fs.statSync(path).isDirectory();
  if (isDirectory) {
    await yarnInstall(path);
  }

  await updateWithFlow(path, true);
}

const pathArg = process.argv[2];
run(pathArg);
