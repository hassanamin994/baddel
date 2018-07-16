

const responseUtils = {
    
    jsonSuccess: function(res, data = {}) {
        return res.status(200).json(data);
    },

    jsonError: function(res, msg) {
        return res.status(400).json({res_text: msg});
    },

    jsonValidate: function(res, msg) {
        return res.status(412).json({res_text: msg});
    },

    jsonNotAuthorized: function(res, msg = '') {
        return res.status(401).json({res_text: 'Unauthorized ' + msg});
    },

    jsonNotFound: function(res) {
        return res.status(404).json({res_text: 'Not found'})
    }

    
}

module.exports = exports = responseUtils;
