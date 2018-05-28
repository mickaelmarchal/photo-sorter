var exifUtils = require('./src/exifUtils');
var fileUtils = require('./src/fileUtils');
var ProgressBar = require('progress');

// Get base directory from args - use current dir if not specified
var baseDir = '.';
if (typeof process.argv[2] != 'undefined') {
  baseDir = process.argv[2];
}

// Configure progress bar

console.log('Browsing directory "' + fileUtils.getAbsolutePath(baseDir) + '", please wait...');

fileUtils.getFilesListInDirTree(baseDir).then((filesList) => {

  console.log(filesList.length + ' files found in directory "' + fileUtils.getAbsolutePath(baseDir) + '".');

  var bar = new ProgressBar('[:bar] :percent', { done: 0, total: filesList.length * 2, complete: '#', incomplete: '-', });

  for (file of filesList) {
    exifUtils.getTakenDate(file, bar)
      .then(result => fileUtils.moveFileToDirectory(baseDir, result, bar))
      // .then(newResult => xxxx)
      .catch(err => console.log('UNHANDLED ERROR: ' + err))
  };

});

