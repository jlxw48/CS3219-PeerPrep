const User = require('../models/User');
const responseStatus = require('../common/responseStatus');
const clientErrorMessages = require('../common/clientErrors');
const clientSuccessMessages = require('../common/clientSuccess');
const dbErrorMessages = require('../common/dbErrors');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const hasMissingNameField = (req) => {
	return req.body.name == undefined || req.body.name.length == 0;
}

const hasMissingEmailField = (req) => {
	return req.body.email == undefined || req.body.email.length == 0;
};

const hasMissingPasswordField = (req) => {
	return req.body.password == undefined || req.body.password.length == 0;
};

const hasMissingAuthFields = (req) => {
	return Object.keys(req.body).length == 0; 
};

const isPasswordAndUserMatch = (req, res) => {
	const email = req.body.email;
	User.find({email: email})
        .then((result) => {
            if (Object.keys(result).length == 0) {
				res.status(400).send({
            		status: responseStatus.FAILURE,
            		data: {
                		message: clientErrorMessages.INVALID_EMAIL
            		}
        		});
        		return;
			}
			
			data = result[0];
			let passwordFields = data.password.split('$');
        	let salt = passwordFields[0];
        	let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
			if (hash == passwordFields[1]) {
				const token = jwt.sign(
					{
						email: email,
						name: data.name
					},
					'CS3219_SECRET_KEY',
					{
						expiresIn: "7d",
					}
				); 

        		res.status(200).cookie("cs3219_jwt", token, {
            			httpOnly: true
            		}).json({
   					status: responseStatus.SUCCESS, 
    				data: {
    					email: email,
        				message: clientSuccessMessages.VALID_LOGIN
    				}
  				  });
   				return;
   			} else {
           		res.status(400).send({
           			status: responseStatus.FAILURE,
           			data: {
           				message: clientErrorMessages.INVALID_PASSWORD
            		}
            	});
            	return;
        	}
			
        });
};

exports.create_account = (req, res) => {

	if (hasMissingAuthFields(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_NAME_EMAIL_PASSWORD
			}
		});
		return;
	}

	if (hasMissingNameField(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_NAME
			}
		});
		return;

	}
	if (hasMissingEmailField(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_EMAIL
			}
		});
		return;
	}
	if (hasMissingPasswordField(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_PASSWORD
			}
		});
		return;
	}
	const email = req.body.email;
	User.find({email: email})
		.then((result) => {
			if (Object.keys(result).length == 0) {
				let salt = crypto.randomBytes(16).toString('base64');
				let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
				const password = salt + "$" + hash;
				req.body.permissionLevel = 1;
				const name = req.body.name;
				const permissionLevel = req.body.permissionLevel;

				const user = new User({
					name : name,
					email : email,
					password : password,
					permissionLevel : permissionLevel
				});
				user.save().then((result) => {
					res.status(201).send({
						status: responseStatus.SUCCESS,
						data: {
							message: clientSuccessMessages.CREATE_ACCOUNT
						}
					});
					return;    
					});  		
        	} else {
				res.status(404).send({
            		status: responseStatus.FAILURE,
            		data: {
                		message: clientErrorMessages.USER_EXISTS + email
            		}
        		});
        		return;
			}
		}).catch((err) => {
             res.status(500).json({
                 status: responseStatus.ERROR,
                 error_message: dbErrorMessages.writeError(err)
             });
         });
         return;
};

exports.user_login = (req, res) => {
	if (hasMissingAuthFields(req)) {
		res.status(400).send({ 
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_EMAIL_AND_PASSWORD
			}
		});
		return;
	}

	if (hasMissingEmailField(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_EMAIL
			}
		});
		return;
	}

	if (hasMissingPasswordField(req)) {
		res.status(400).send({
			status: responseStatus.FAILURE,
			data: {
				message: clientErrorMessages.MISSING_PASSWORD
			}
		});
		return;
	}

	return isPasswordAndUserMatch(req, res);
};

exports.user_logout = (req, res) => {
	res.status(200).clearCookie("cs3219_jwt")
	.json({
		status: responseStatus.SUCCESS, 
    	data: {
        	message: clientSuccessMessages.USER_LOGOUT
    	}
    });
};
exports.jwt_validate = (req, res) => {
    const token = req.cookies.cs3219_jwt;
    try {
        if (!token) {
			console.log("4");
            return res
                .status(401)
                .json({
                    status: responseStatus.FAILURE,
                    data: {
						message: clientErrorMessages.JWT_AUTH_FAILED
					}
                });
        }
    
        jwt.verify(token, 'CS3219_SECRET_KEY', (err, user) => {
            if (err) {
				console.log("1");
                console.log(err);
                return res
                .status(401)
                .json({
                    status: responseStatus.FAILURE,
                    message: clientErrorMessages.JWT_AUTH_FAILED
                });
            }
			console.log("2");
            req.user = user;
			res.status(200).send({
				status: responseStatus.SUCCESS,
				data: {
					email: user.email,
					name: user.name
				}
			});
			return;
        });
    } catch (error) {
		console.log("3");
        res.status(500).send({
			status: responseStatus.ERROR,
			data: {
				message: JWT_ERROR(error)
			}
		});
    }
}
