const router = require('express').Router();
const Category = require('../models/Category');
const responseUtils = require('../utils/responseUtils');


const categories = {
    getAll: function (req, res) {
        Category.find()
            .then(categories => responseUtils.jsonSuccess(res, categories))
            .catch(err => {
                console.log(err);
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            });
    },

    create: function (req, res) {
        const { name, icon, parentId } = req.body;
        const category = new Category({
            name,
            icon,
            parentId
        });
        category.save((err, c) => {
            if (err) {
                return responseUtils.jsonError(res, 'An error has occured, please try again');
            }
            return responseUtils.jsonSuccess(res, category);
        })
    },

    remove: function (req, res) {
        const id = req.param.id;
        Category.findByIdAndRemove(id, (err, result) => {
            if (err) {
                return responseUtils.jsonError(res, 'error removing category')
            };
            return responseUtils.jsonSuccess(res);
        })
    }
}

module.exports = exports = categories;