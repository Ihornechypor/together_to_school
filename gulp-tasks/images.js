const fs = require('fs');
const glob = require('glob');
const path = require('path');
const sharp = require('sharp');

const transforms = [
    {
        src: './src/images/**/*.*',
        dist: './dist/images/',
        options: {
            width: 800,
            height: 600,
            fit: 'cover'
        }
    }
];

// resize images
function resizeImages(done) {
    // loop through configuration array of objects
    transforms.forEach(function(transform) {
        // if dist folder does not exist, create it with all parent folders
        if (!fs.existsSync(transform.dist)) {
            fs.mkdirSync(transform.dist, { recursive: true }, (err) => {
                if (err) throw err;
            });
        }

        // glob all files
        let files = glob.sync(transform.src);

        // for each file, apply transforms and save to file
        files.forEach(function(file) {
            let filename = path.basename(file);
            sharp(file)
                .resize(transform.options)
                .toFile(`${transform.dist}/${filename}`)
                .catch(err => {
                    console.log(err);
                });
        });
    });
    done();
}

// exports (Common JS)
module.exports = {
    resize: resizeImages
};