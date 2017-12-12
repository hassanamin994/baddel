const path = require('path');
const fs = require('fs');
const AllowedImageExtensions = ['png', 'jpg', 'jpeg'];


const saveBase64File = (base64code, type, dest, callback) => {
    callback = callback || function () {}
    return new Promise((resolve, reject) => {
        var errors = [];
        var matches = base64code.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) || [];
        console.log(matches.length);
        if(matches.length != 3) {
            errors.push("Invalid Image");
        } else {
            var ext = matches[1];
            var e = ext.split('/')[1];
            console.log('EXT: ' + e)
            console.log(e !== "png" || e !== "jpg")

            switch(type) {
                case 'image':
                    if(AllowedImageExtensions.indexOf(e) < 0){
                        errors.push("Invalid Image extension");
                    }

                    if(errors.length > 0) {
                        reject(errors);
                        return callback(errors);
                    }

                    data = matches[2];
                    saveImage(data, e, dest)
                    .then(imagePath => {
                        resolve(imagePath);
                        return callback(null, imagePath);
                    })
                    .catch(err => {
                        reject(err);
                        return callback(err); 
                    });

                    break;
                default: 
                    errors.push('Unhandeled file type');
                    reject(errors);
                    return callback(errors);
            }
            
        }
    })
}

const saveImage = (data, extension, dest, callback) => {
    callback = callback || function () {}
    return new Promise((resolve, reject) => {
        var imageBuffer = new Buffer(data, 'base64');
        // console.log(data);
        var imageName = "pic" + Math.floor(Math.random()*(100000)) + "_" + Date.now() +'.' + extension;
        const filePath = path.join(__dirname, '../../public', dest);
        const fullImagePath = filePath + '/' + imageName;
        fs.writeFile(fullImagePath, imageBuffer, (err) => {

            if(err) {
                reject(err);
                return callback(err);
            }

            resolve(`/${dest}/${imageName}`)
            return callback(null, `/images/${imageName}` );

        });
    });

}










module.exports = {
    saveBase64File,

};