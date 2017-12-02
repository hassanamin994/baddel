const path = require('path');
const AllowedImageExtensions = ['png', 'jpg', 'jpeg'];


const saveBase64File = (base64code, type, dest, callback) => {
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
                        callback(errors);
                        return reject(errors);
                    }

                    data = matches[2];
                    saveImage(data, e, 'images')
                    .then(imagePath => {
                        callback(null, imagePath);
                        return resolve(imagePath);
                    })
                    .catch(err => {
                        callback(err); 
                        return reject(err);
                    });

                    break;
                default: 
                    errors.push('Unhandeled file type');
                    callback(errors);
                    return reject(errors);
            }
            
        }
    })
}

const saveImage = (data, extension, dest, callback) => {
    return new Promise((resolve, reject) => {
        var imageBuffer = new Buffer(data, 'base64');
        console.log(data);
        var imageName = "pic" + Math.floor(Math.random()*(100000)) + "_" + (new Date()) +'.' + extension;
        const filePath = path.join(__dirname, '../../public', dest);
        const fullImagePath = filePath + '/' + imageName;
        fs.writeFile(fullImagePath, imageBuffer, (err) => {

            if(err) {
                callback(err);
                return reject(err);
            }

            callback(null, fullImagePath );
            return resolve(fullImagePath)

        });
    });

}










module.exports = {
    saveBase64File,

};