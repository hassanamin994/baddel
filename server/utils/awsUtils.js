const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;


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

// const putObject = (filename, data, callback) => {
//     callback = callback || function () {}
//     let options = {
//         Bucket: bucketName,
//         Key: filename,
//         Body: data
//     };

//     return new Promise((resolve, reject) => {
//         s3.putObject(options, (err, data ) => {
//             if (err) {
//                 reject(err);
//                 return callback(err);
//             }
            
//         }); 
//     })  
// }