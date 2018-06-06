import * as ProgressBar from 'progress';
import * as exifUtils from './src/exifUtils';
import * as fileUtils from './src/fileUtils';

// Get base directory from args - use current dir if not specified
let baseDir = '.';
if (typeof process.argv[2] !== 'undefined') {
  baseDir = process.argv[2];
}

// Configure progress bar

console.log('Browsing directory "' + fileUtils.getAbsolutePath(baseDir) + '", please wait...');


// TODO refactor this: use promises and move to appropriate file
function handleFile(idx: number, filesList: string[], bar: any, callback: any) {
  exifUtils.getTakenDate(filesList[idx])
    .then(result => fileUtils.moveFileToDirectory(baseDir, result, bar))
    .catch(err => {
      bar.interrupt('[ERROR] ' + err);
    })
    .finally(() => {
      bar.tick();
      if ((idx + 1) < filesList.length) {
        handleFile(idx + 1, filesList, bar, resolve);
      } else {
        callback();
      }
    });
}


fileUtils.getFilesListInDirTree(baseDir).then((filesList: string[]) => {
  console.log(filesList.length + ' files found in directory "' + fileUtils.getAbsolutePath(baseDir) + '".');
  const bar = new ProgressBar('[:bar] :percent', { total: filesList.length, complete: '#', incomplete: '-', });
  handleFile(0, filesList, bar, () => console.log('FINISHED!'));
});

