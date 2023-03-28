const authticateService = require('../services/authService');
const { check, validationResult } = require('express-validator');

exports.signUp = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const authservice = new authticateService();
    authservice.registerUser(req.body).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
}

exports.logIn = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const authservice = new authticateService();
    const { email, password } = req.body;
    authservice.loginUser(email, password).then((result) => {
        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }
        res.cookie("token", result.token, { expire: new Date() + 9999 });
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
}

exports.logOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
}

//custorm middleware

exports.isSignedIn = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    req.token = token;
    // console.log(req.body);
    if (!token) {
        return res.status(401).json({
            error: "User not logged in"
        });
    }
    const authservice = new authticateService();
    authservice.verifyToken(token).then((result) => {
        req.user = result;
        next();
    }).catch((err) => {
        res.status(401).json({
            error: "User not logged in"
        });
    });
}


exports.isAuthenticated = (req, res, next) => {
        console.log('isAuthenticated');
        console.log(req.profile._id);
        console.log(req.user._id);
        if(!req.profile._id.equals(req.user._id)) {
            return res.status(401).json({
                error: "User not authorized"
            });
        }
        next();
}

exports.isEducator = (req, res, next) => {
        if(req.user.role !== "educator") {
            return res.status(401).json({
                error: "User not authorized"
            });
        }
        next();
}