var fs = require('fs');
var q = require('q');
var mkdirp = require('mkdirp');

var ExifImage = require('exif').ExifImage;


// Get base directory from args - use current dir if not specified
var baseDir = '.';
if(typeof process.argv[2] != 'undefined') {
  baseDir = process.argv[2];
}

/**
 * Read exif data for given file
 * If file is not a picture, return an exception
 */
var getPhotoTakenDate = function(filename) {

  var deferred = q.defer();

  new ExifImage({image: baseDir + '/' + filename}, function (error, exifData) {
    if (error) {
      deferred.reject(error);
    } else {
      if (typeof exifData.exif.DateTimeOriginal == "undefined") {
        deferred.reject("Could not find the date in EXIF data for file " + filename);
      }

      try {
        // retrieve date and convert in a Date object
        var date = new Date(exifData.exif.DateTimeOriginal.replace(
          /^([0-9]{4}):([0-9]{2}):([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/i,
          "$1-$2-$3T$4:$5:$6"
        ));

        if (! date) {
          deferred.reject('Date not valid');
        }

        deferred.resolve({
          filename: filename,
          takenDate: date
        });

      } catch(e) {
        deferred.reject('Unable to parse date "' + exifData.exif.DateTimeOriginal + '" in EXIF data for file ' + filename);
      }
    }
  });

  return deferred.promise;
};


/**
 * Move the given file to a directory corresponding to given date
 * (directory is created if not exists)
 */
var moveToDateDirectory = function(filename, date) {

  var deferred = q.defer();
  var dirName = date.toISOString().substring(0, 10);

  // create directory (if not existing)
  mkdirp(baseDir + '/' + dirName, function(error) {

      if(error) {
        deferred.reject('Could not create / access directory "' + baseDir + '/' + dirName + '": ' + error);
      }

      // move file to directory
      fs.rename(baseDir + '/' + filename, baseDir + '/' + dirName + '/' + filename, function(error) {
        if(error) {
          deferred.reject('Could not move file "' + filename + '" to directory "' + baseDir + '/' + dirName + '"');
        } else {
          deferred.resolve({
            dirName: dirName,
            filename: filename
          });
        }
      });

  });

  return deferred.promise;
};




fs.readdir(baseDir, function(error, files) {
  if (! error) {

    // Find images and read exif data
    for(var i = 0; i < files.length; i++) {
      if(files[i].match(/\.(jpg|jpeg)$/i)) {

        getPhotoTakenDate(files[i]).then(
          function(data) {
            moveToDateDirectory(data.filename, data.takenDate).then(
              function(data) {
                console.log('File "' + data.filename + '" moved to directory "' + data.dirName + '"');
              },
              function(error) {
                console.log(error);
              }
            );
          },
          function(error) {
            console.log(error);
          })
        ;


      }
    }

  } else {
    throw error;
  }
});
