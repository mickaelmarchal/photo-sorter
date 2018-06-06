import * as fs from 'fs';
import * as path from 'path';
import * as recursive from 'recursive-readdir';

/**
 * Get the list of all files in a directory and sub directories
 * Just a Promise wrapper around "recursive" npm package.
 */
export function getFilesListInDirTree(baseDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        recursive(baseDir, (err: any, files: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

/**
 * Get the absolute path of a file
 */
export function getAbsolutePath(filePath: string) {
    return path.resolve(filePath);
}

/**
 * Extract the filename from a full path 
 */
export function getFilename(fullPath: string) {
    return fullPath.replace(/^.*[\\\/]/, '');
}


/**
 * Get the directory in which to move the file
 * 
 * @param {string} baseDir 
 * @param {{takenDate: string, filename: string}} fileInfo
 */
export function getTargetDirectory(baseDir: string, fileInfo: any) {
    let dirName = '';
    if (fileInfo.takenDate instanceof Date) {
        dirName = 'sorted' + path.sep + fileInfo.takenDate.toISOString().substring(0, 10);
    } else if (typeof fileInfo.takenDate === null) {
        dirName = 'unsorted';
    }

    return baseDir + path.sep + dirName + path.sep + exports.getFilename(fileInfo.filename);
}

/**
 * Move the given file to a directory corresponding to given date
 * (directory is created if not exists)
 */
export function moveFileToDirectory(baseDir: string, fileInfo: any, bar: any) {
    return new Promise((resolve, reject) => {
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
}


