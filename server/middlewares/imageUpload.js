const saveBase64File = require('../utils/filesUtils').saveBase64File;

const uploadImages = (req, res, next) => {
    const images = req.body.images;
    const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    if(!images || !images.length || images.length == 0 ) {
        return next();
    }

    images.forEach(image => {
        // check for matching base64 images
        if(image.match(regex)) {
            return res.json(image);
        }
    });

};



module.exports = {
    uploadImages
}