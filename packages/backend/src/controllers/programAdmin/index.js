const programAdminModel = require("../../models/programAdmin")
const userModel = require("../../models/users");
const taskClient = require("../../models/taskClient");
const request = require("../../models/request");
const bcrypt = require("bcryptjs");
const { createTransporter } = require('../../services/emailServices/transPorter');

const sendPasswordResetEmail = async (email, token, user_name) => {
    let transporter = createTransporter

    const resetLink = `${process.env.CURRENT_URL}/set-pa-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Set Up Your Upstrem Health Account Password',
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Upstrem Health!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  padding: 20px;
                  background-color: #fff;
                  border: 1px solid #ddd;
                  border-radius: 10px;
              }
              h2 {
                  text-align: center;
                  color: #FEBC5A;
              }
              p {
                  color: #333;
              }
              a {
                  color: #ffffff;
              }
              .ii a[href] {
                color: white;
              }
              .btn {
                  display: inline-block;
                  background-color: #FEBC5A;
                  color: #ffffff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  text-align: center;
              }
              ul {
                  padding-left: 20px;
              }
              li {
                  margin-bottom: 10px;
              }
              hr {
                  border: 0;
                  border-top: 1px solid #ddd;
                  margin: 20px 0;
              }
              .footer {
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Welcome to Upstrem Health!</h2>
              <p>Hello ${user_name},</p>
              <p>We're thrilled to have you join our team. To get started, please take a moment to set up your account password:</p>
              <p style="text-align: center;">
                  <a class="btn" href="${resetLink}" style="color: white;">Set Password</a>
              </p>
              <p>If you need any assistance or have questions, feel free to contact our support team at <a href="mailto:upstreamhealth@breadoflifeinc.org" style="color: #FEBC5A;">upstreamhealth@breadoflifeinc.org</a>.</p>
              <h3 style="color: #FEBC5A;">Security Tips:</h3>
              <ul>
                  <li>Use a unique password that you don't use for any other accounts.</li>
                  <li>Include a mix of letters, numbers, and special characters in your password.</li>
                  <li>Avoid using easily guessable information such as your name, birthdate, or common words.</li>
              </ul>
              <p>We're looking forward to working with you!</p>
              <p>Best regards,</p>
              <p>The Upstrem Health Team</p>
              <hr>
              <p class="footer">
                  If you did not request this account setup, it is possible that someone else has entered your email address by mistake. If you believe this is the case, please secure your account by changing your password immediately and contacting support.
              </p>
          </div>
      </body>
      </html>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function generateString(length, characters) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    const randomString = result + characters;
    return randomString;
}

const createPA = async (req, res) => {
    try {
        const { firstName, lastName, Phone, email, address, zipCode, pa_program } = req.body

        const findPA = await userModel.findOne({ email: email, role: "Program_Administrator" })
        if (findPA) {
            return res.status(403).json({ status: false, message: "User already exists" })
        }

        const newPA = new userModel({
            firstName: firstName,
            lastName: lastName,
            Phone: Phone,
            email: email,
            address: address,
            zipCode: zipCode,
            pa_program: pa_program,
            role: "Program_Administrator"
        })
        await newPA.save()

        const characters = newPA._id.toString();
        const randomKey = generateString(5, characters);

        const now = new Date();
        now.setHours(now.getHours() + 2);
        newPA.metaKeyTimeLimit = now;

        newPA.is_pa_pwd_set = false
        newPA.metaKey = randomKey;
        await newPA.save();

        const username = `${firstName}  ${lastName}`

        sendPasswordResetEmail(email, randomKey, username)

        return res.status(200).json({
            status: true,
            message: "Program Admin created",
            data: newPA
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: true,
            message: "Internal Server Error"
        })
    }
}

const verifyKey = async (req, res) => {
    try {
        const data = await userModel.findOne({ metaKey: req.params.token }).lean();

        if (data?.is_pa_pwd_set === true) {
            return res.status(403).json({
                status: false,
                message: "Using this link, Your password has been set."
            })
        }

        if (!data) {
            return res.status(403).json({ status: false, message: "The key has been expired. Please request for new one." });
        }
        if (new Date(data?.metaKeyTimeLimit) <= new Date()) {
            return res.status(403).json({ status: false, message: "The key has been expired. Please request for new one." });
        }

        return res.status(201).json({
            status: true,
            message: "Key verified",
        });
    } catch (error) {
        console.log("error", error);
        // return res.status(500).json(INTERNAL_SERVER_ERROR);
    }
};

const setPasswordForPA = async (req, res) => {
    try {
        const users = await userModel.findOne({ metaKey: req.body.token, role: "Program_Administrator" });

        if (!users) {
            return res.status(403).json({
                status: false,
                message: "User not found"
            });
        }

        let hashedPassword;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        hashedPassword = await bcrypt.hash(req.body.password, salt);

        const updatedUser = await userModel.findOneAndUpdate({ metaKey: req.body.token }, { $set: { password: hashedPassword, is_pa_pwd_set: true } }, { new: true });

        // await users.save();
        return res.status(201).json({ status: true, message: "Password Reset successfully. Please try to login.", data: updatedUser });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const deletePA = async (req, res) => {
    try {
        const deleteData = await userModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isArchive: true } }, { new: true })
        return res.status(200).json({
            status: true,
            message: "Program admin deleted successfully",
            data: deleteData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: true,
            message: "Internal Server Error"
        })
    }
}

const updatePA = async (req, res) => {
    try {
        const updateData = await userModel.findOneAndUpdate({ _id: req.body.id }, { $set: { ...req.body } }, { new: true })
        return res.status(200).json({
            status: true,
            message: "Program Admin data updated",
            data: updateData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: true,
            message: "Internal Server Error"
        })
    }
}

const getAllPA = async (req, res) => {
    try {
        const payload = req.body;
        const query = { isArchive: false, role: "Program_Administrator" };

        if (payload) {
            const nameRegex = new RegExp(payload, 'i');

            query.$or = [
                { firstName: nameRegex },
                { lastName: nameRegex },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ["$firstName", " ", "$lastName"] },
                            regex: nameRegex
                        }
                    }
                }
            ];
        }

        const programAdmins = await userModel.find(query).lean();

        const paWithChwCountPromises = programAdmins.map(async (pa) => {
            const chwCount = await userModel.countDocuments({
                isArchive: false,
                role: "CHW",
                pa_id: pa._id
            });

            return {
                ...pa,
                chwCount
            };
        });

        const programAdminsWithChwCounts = await Promise.all(paWithChwCountPromises);

        return res.status(200).json({
            status: true,
            message: "Program Admins and corresponding CHWs listed",
            data: programAdminsWithChwCounts
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};

const getSinglePA = async (req, res) => {
    try {
        const getData = await userModel.findOne({ _id: req.params.id })
        return res.status(200).json({
            status: true,
            message: "Program Admin fetched",
            data: getData
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: true,
            message: "Internal Server Error"
        })
    }
}

const getPAwiseCHW = async (req, res) => {
    try {
        if (req.body.id) {
            const { id, search } = req.body;

            let searchFilter = {
                role: "CHW",
                pa_id: id,
                isArchive: false,
            };

            if (search) {
                const nameRegex = new RegExp(search, 'i');
                searchFilter.$or = [
                    { firstName: nameRegex },
                    { lastName: nameRegex },
                    { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
                ];
            }

            let getDataofCHW = await userModel.find(searchFilter)
                .select('firstName lastName _id')
                .lean();

            getDataofCHW = await Promise.all(getDataofCHW.map(async (user) => {
                const usersCount = await userModel.countDocuments({ assign_to: user._id, isArchive: false });
                const taskCount = await taskClient.countDocuments({ assign_to: user._id, isArchive: false });
                const requestCount = await request.countDocuments({ assigned_chw: user._id, isArchive: false });

                return {
                    user,
                    usersCount,
                    taskCount,
                    requestCount
                };
            }));

            return res.status(200).json({
                status: true,
                message: "Program Admin wise CHW fetched",
                data: getDataofCHW
            });
        } else {
            const { search } = req.body;

            let searchFilter = {
                role: "CHW",
                pa_id: req.userId,
                isArchive: false,
            };

            if (search) {
                const nameRegex = new RegExp(search, 'i');
                searchFilter.$or = [
                    { firstName: nameRegex },
                    { lastName: nameRegex },
                    { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
                ];
            }

            let getDataofCHW = await userModel.find(searchFilter)
                .select('firstName lastName _id')
                .lean();

            getDataofCHW = await Promise.all(getDataofCHW.map(async (user) => {
                const usersCount = await userModel.countDocuments({ assign_to: user._id, isArchive: false });
                const taskCount = await taskClient.countDocuments({ assign_to: user._id, isArchive: false });
                const requestCount = await request.countDocuments({ assigned_chw: user._id, isArchive: false });

                return {
                    user,
                    usersCount,
                    taskCount,
                    requestCount
                };
            }));

            return res.status(200).json({
                status: true,
                message: "Program Admin wise CHW fetched",
                data: getDataofCHW
            });
        }

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};


const assignPAIdtoCHW = async (req, res) => {
    try {
        const fetchCHW = await userModel.find({ role: "CHW", isArchive: false }).lean()
        const fetchPA = await userModel.find({ isArchive: false, role: "Program_Administrator" }).lean()

        for (let i = 0; i < fetchCHW.length; i++) {
            const question = fetchCHW[i];
            await userModel.updateOne(
                { _id: question._id },
                { $set: { pa_id: fetchPA[0]._id } }
            );
        }

        return res.status(201).json({
            status: true,
            message: "PA ID added into CHW"
        })
    } catch (error) {
        console.log("error", error)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const listAndSerchPA = async (req, res) => {
    try {
        const { search } = req.body;

        let query = { isArchive: false, role: "Program_Administrator" };

        if (search) {
            const nameRegex = new RegExp(search, 'i');
            query.$or = [
                { firstName: nameRegex },
                { lastName: nameRegex },
                { $expr: { $regexMatch: { input: { $concat: ["$firstName", " ", "$lastName"] }, regex: nameRegex } } }
            ]
        }

        const users = await userModel.find(query).select("firstName lastName isArchive _id")

        const formattedUsers = users.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user._id,
            isArchive: user.isArchive
        }));

        res.status(200).json({
            status: true,
            message: "Users retrieved successfully",
            data: formattedUsers
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while retrieving users",
            error: error.message
        });
    }
}

module.exports = {
    createPA,
    verifyKey,
    deletePA,
    updatePA,
    getAllPA,
    getSinglePA,
    getPAwiseCHW,
    assignPAIdtoCHW,
    listAndSerchPA,
    setPasswordForPA
}