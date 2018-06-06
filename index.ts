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

fileUtils.getFilesListInDirTree(baseDir).then((filesList: string[]) => {

  console.log(filesList.length + ' files found in directory "' + fileUtils.getAbsolutePath(baseDir) + '".');

  const bar = new ProgressBar('[:bar] :percent', { total: filesList.length * 2, complete: '#', incomplete: '-', });
  const a = 1;


  for (const file of filesList) {
    exifUtils.getTakenDate(file, bar)
      .then(result => fileUtils.moveFileToDirectory(baseDir, result, bar))
      // .then(newResult => xxxx)
      .catch(err => bar.interrupt('UNHANDLED ERROR: ' + err))
  };

});

