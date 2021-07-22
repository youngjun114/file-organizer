const fs = require('fs');
const path = require('path');
const os = require('os');

const folder = process.argv[2];
const workingDir = path.join(os.homedir(), 'Pictures', folder);

if (!folder || !fs.existsSync(workingDir)) {
  console.error('Please enter folder name in Pictures');
  return;
}

const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

// mkdirSync was used because it needs to be synchronous
!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

fs.promises
  .readdir(workingDir) //
  .then((files) => processFiles(files))
  .catch(console.error);

function processFiles(files) {
  files.forEach((file) => {
    if (isVideoFile(file)) {
      moveFile(file, videoDir);
    } else if (isCapturedFile(file)) {
      moveFile(file, capturedDir);
    } else if (isDuplicatedFile(file)) {
      moveFile(file, duplicatedDir);
    }
  });
}

function isVideoFile(file) {
  const regExp = /(mp4|mov)$/gm;
  const match = file.match(regExp);
  return !!match;
}

function isCapturedFile(file) {
  const regExp = /(aae|png)$/gm;
  const match = file.match(regExp);
  return !!match;
}

function isDuplicatedFile(file) {
  const extension = path.extname(file);
  const split = path.basename(file).split('_')[1];
  if (extension === '.jpg' && !split.startsWith('E')) {
    return true;
  } else {
    return false;
  }
}

function moveFile(file, dir) {
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(dir, file);
  fs.promises
    .rename(oldPath, newPath) //
    .catch(console.error);
}
