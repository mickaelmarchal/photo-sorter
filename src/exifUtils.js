var exif = require('exiftool');
var fs = require('fs');

/**
 * Get the date when the picture / video was taken
 */
exports.getTakenDate = (filename, bar) =>

    new Promise((resolve, reject) => {

        // TODO error handling (must create a proper data structure first)
        fs.readFile(filename, (err, data) => {

            if (bar) {
                bar.tick();
            }

            if (err) {
                reject(err);
                if (bar) {
                    bar.tick();
                }
            } else {

                exif.metadata(data, (err, metadata) => {

                    if (bar) {
                        bar.tick();
                    }

                    if (err) {
                        reject(err);
                    } else {
                        try {
                            // retrieve date and convert in a Date object
                            var takenDateRaw = metadata['date/timeOriginal'];
                            if (typeof takenDateRaw === 'undefined') {
                                takenDateRaw = metadata.createDate;
                            }

                            // TODO handle timezones
                            var takenDate = new Date(takenDateRaw.replace(
                                /^([0-9]{4}):([0-9]{2}):([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/i,
                                "$1-$2-$3T$4:$5:$6"
                            ));

                            if (!takenDate) {
                                reject('Date not valid');
                            }

                            resolve({
                                filename: filename,
                                takenDate: takenDate
                            });

                        } catch (e) {
                            reject('Unable to parse date "' + takenDate + '" in EXIF data for file ' + filename);
                        }
                    }
                });
            }
        });
    });
