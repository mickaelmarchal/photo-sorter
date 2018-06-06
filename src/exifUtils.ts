import * as exif from 'exiftool';
import * as fs from 'fs';

/**
 * Get the date when the picture / video was taken
 */
export function getTakenDate(filename: string): Promise<any> {

    return new Promise((resolve, reject) => {

        // TODO error handling (must create a proper data structure first)
        fs.readFile(filename, (readErr, data) => {

            if (readErr) {
                reject(readErr);
            } else {

                exif.metadata(data, (exifErr: any, metadata: any) => {

                    if (exifErr) {
                        reject(exifErr);
                    } else {

                        let takenDate = null;
                        try {
                            // retrieve date and convert in a Date object
                            let takenDateRaw = metadata['date/timeOriginal'];
                            if (typeof takenDateRaw === 'undefined') {
                                takenDateRaw = metadata.createDate;
                            }

                            // TODO handle timezones
                            takenDate = new Date(takenDateRaw.replace(
                                /^([0-9]{4}):([0-9]{2}):([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/i,
                                "$1-$2-$3T$4:$5:$6"
                            ));

                            if (!takenDate) {
                                reject('Date not valid');
                            }

                            resolve({
                                filename,
                                takenDate
                            });

                        } catch (e) {
                            reject('Unable to parse date "' + takenDate + '" in EXIF data for file ' + filename);
                        }
                    }
                });
            }
        });
    });
}
