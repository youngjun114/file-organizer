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
      console.log(`${file} is a video file`);
    } else if (isCapturedFile(file)) {
      console.log(`${file} is a captured file`);
    } else if (isDuplicatedFile(file)) {
      console.log(`${file} is a duplicated file`);
    }
  });
}

function isVideoFile(file) {
  const extension = path.extname(file);
  if (extension === '.mp4' || extension === '.mov') {
    return true;
  } else {
    false;
  }
}
function isCapturedFile(file) {
  const extension = path.extname(file);
  if (extension === '.aae' || extension === '.png') {
    return true;
  } else {
    false;
  }
}
function isDuplicatedFile(file) {
  const extension = path.extname(file);
  const split = path.basename(file).split('_');
  const result = split[1];
  if (extension === '.jpg' && result[0] !== 'E') {
    return true;
  } else {
    false;
  }
}
