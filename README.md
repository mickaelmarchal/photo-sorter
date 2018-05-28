# photo-sorter
A simple script to sort a bunch of photos into date directories.

The script will search into the given directory for all JPEG images and will sort them in subdirectories.

Subdirectories are created in the working directory and will be named upon the date of the pictures found in EXIF metadata.

If the date could not be found in EXIF metadata, the photo will not be moved.

## Install

Just use `npm install` to install dependencies.

## Usage

Sort pictures in the current directory:

    node index.js

Sort pictures in a provide directory:

    node index.js /path/to/directory


## Example

A folder "MyPictures" containing various files:

    MyPictures
    |- dsc0001.jpg
    |- dsc0002.jpg
    |- dsc0003.jpg
    |- dsc0004.jpg
    |- dsc0005.jpg
    |- other_file.txt
    |- jpeg_without_exif.jpg

Run the script with the folder path as first argument:

`node index.js /path/to/MyPictures`


The pictures will automatically sorted by date:

    MyPictures
    |- 2016-07-01
    |  |- dsc0001.jpg
    |  |- dsc0002.jpg
    |
    |- 2016-07-02
    |  |- dsc0003.jpg
    |  |- dsc0004.jpg
    |
    |- 2016-07-05
    |  |- dsc0005.jpg
    |
    |- other_file.txt
    |- jpeg_without_exif.jpg


The .txt file and the jpeg file containig no EXIF data have not been moved.


## License and copyright

Copyright (c) 2016 Mickaël Marchal.

This software is released under the [MIT licence](LICENSE).
