const router = require('express').Router();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { Users } = require('../models/users');

router.post('/new-password', async (req, res) => {
    try {
        let { id, token, password, confirm_password } = req.body;
        if (!id || !token || !password) {
            return res.status(200).json({
                message: "Missing field",
                status: 0
            })
        }
        const user = await Users.findOne({ _id:id });
        // check if this id exist or not
        if (user) {
            // id verified
            const secret = process.env.FP_SECRET + user.password;
            try {

                //token verified
                const payload = jwt.verify(token, secret);
                {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    // payload contains id and email of the user
                    Users.findByIdAndUpdate(payload.id, { password: hashedPassword }).exec(async function (err, data) {
                        if (err)
                            return res.status(200).json({
                                message: err.message,
                                status: 0
                            })
                            //password changed
                            res.status(200).json({
                                message: "Password changed successfully",
                                status: 1,
                                data
                            })
                    })


                }
            } catch (error) {
                return res.status(200).json({
                    message: error.message,
                    status: 0
                })
            }
        }
        else {
            return res.status(200).json({
                message: "Invalid id",
                status: 0
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: 0
        });
    }
});

module.exports = router;
