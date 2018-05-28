const fs = require('fs');
const recursive = require("recursive-readdir");
const path = require('path');

/**
 * Get the list of all files in a directory and sub directories
 * Just a Promise wrapper around "recursive" npm package.
 * 
 * @param {string} baseDir 
 */
exports.getFilesListInDirTree = (baseDir) =>
    new Promise((resolve, reject) => {
        recursive(baseDir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });


/**
 * Get the absolute path of a file
 * @param {string} filePath
 */
exports.getAbsolutePath = (filePath) => path.resolve(filePath);

/**
 * Extract the filename from a full path 
 * @param {string} fullPath 
 */
exports.getFilename = (fullPath) => fullPath.replace(/^.*[\\\/]/, '');


/**
 * Get the directory in which to move the file
 * 
 * @param {string} baseDir 
 * @param {{takenDate: string, filename: string}} fileInfo
 */
exports.getTargetDirectory = (baseDir, fileInfo) => {
    if (fileInfo.takenDate instanceof Date) {
        var dirName = 'sorted' + path.sep + fileInfo.takenDate.toISOString().substring(0, 10);
    } else if (typeof fileInfo.takenDate === null) {
        var dirName = 'unsorted';
    }

    return baseDir + path.sep + dirName + path.sep + exports.getFilename(fileInfo.filename);
}

/**
 * Move the given file to a directory corresponding to given date
 * (directory is created if not exists)
 */
exports.moveFileToDirectory = (baseDir, fileInfo, bar) =>
    new Promise((resolve, reject) => {
        bar.interrupt(fileInfo.filename + ': ' + fileInfo.takenDate + ' => ' + exports.getTargetDirectory(baseDir, fileInfo));

        /*
        // create directory (if not existing)
        mkdirp(baseDir + path.sep + dirName, function (error) {
    
            if (error) {
                deferred.reject('Could not create / access directory "' + baseDir + path.sep + dirName + '": ' + error);
            }
    
            // move file to directory
            fs.rename(baseDir + '/' + filename, baseDir + path.sep + dirName + path.sep + filename, function (error) {
                if (error) {
                    deferred.reject('Could not move file "' + filename + '" to directory "' + baseDir + path.sep + dirName + '"');
                } else {
                    deferred.resolve({
                        dirName: dirName,
                        filename: filename
                    });
                }
            });
    
        });*/

    });



