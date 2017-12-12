const async = require('async');
const saveBase64File = require('../utils/filesUtils').saveBase64File;

const uploadImages = (req, res, next) => {
    const images = req.body.images;
    // console.log(images)
    const regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
    if(!images || !images.length || images.length == 0 ) {
        return next();
    }
    var imageFunctionList = [];
    images.forEach(image => {
        // check for matching base64 images
        if(image.match(regex)) {
            function i(cb) {
                saveBase64File(image, 'image', 'images')
                .then(path => cb(null, path))
                .catch(err => cb(err))
            }
            imageFunctionList.push(i);
        }
    });
    console.log(imageFunctionList.length)

    async.parallel(async.reflectAll(imageFunctionList), (err, paths ) => {
        if(!err)
            req.body.images = paths.map(image => req.protocol + "://" + req.headers.host + image.value);
        next();
    });

};



module.exports = {
    uploadImages
}