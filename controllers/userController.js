const authticateService = require('../services/authService');

exports.getUserById = (req, res, next, id) => {
    const authservice = new authticateService();
    console.log(req.body);
    console.log(id)
    authservice.getUserById(id).then((result) => {
        // console.log(result);
        req.profile = result;
        next();
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

