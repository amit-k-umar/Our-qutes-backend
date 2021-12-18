

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');
const { Users } = require('../models/users');

router.post('/reset-password', async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(200).json({
                message: "Missing field",
                status: 0
            })
        }
        // check if the given email is registered or not 
        const user = await Users.findOne({ email });
        if (user) {
            // user exist and now generating a one time link that will be valid for 15 minutes
            const secret = process.env.FP_SECRET + user.password;
            const id = user._id;
            const name = user.name;
            const mail = user.email;
            const payload = {
                email: mail,
                id: id,
            }
            const token = jwt.sign(payload, secret, { expiresIn: '15m' })
            const link = `${process.env.FRONTEND_URL}/reset/${token}/${id}`
            console.log(link);
            let email_res = await mailer(name, mail, "Password Reset Link", link)
            if (email_res == 1) {
                //email sent for reset password
                res.status(200).json({
                    message: "Password reset link has been sent to your email...",
                    status: 1,
                    token
                });
            }
            else {
                res.status(200).json({
                    message: "Something Went wrong.",
                    status: 0,
                    error: email_res
                });
            }
        }
        else {
            return res.status(200).json({
                message: "Email doesn't exist",
                status: 0
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "error: " + error.message,
            status: 0
        });
    }
});

module.exports = router;
