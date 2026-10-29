const {
  user,
  request,
  todos,
  questionObjective,
  profileQuestion,
  profileQuestionHistory,
  visit,
  taskClient,
  questionnaireModel,
  clientStatusHistoryModel,
} = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  AlreadyExistError,
  InternalServerError,
  InvalidError,
  UnauthorizedError,
  NotAccessError,
} = require("../../utils/errorHandling");
const {
  sendVerifyEmale,
} = require("../../services/emailServices/sendVerifyEmail");
const {
  forgetPasswordMail,
} = require("../../services/emailServices/forgotPassword");
const { contactUsMail } = require("../../services/emailServices/contactUs");
const { addActivityRequest } = require("../activityRequest");
const { deleteFile } = require("../../services/file");
const { default: mongoose } = require("mongoose");
const { isValidObjectId } = require("mongoose");
const resourceGiven = require("../../models/resourceGiven");
const userModel = require("../../models/users");
const { getTalkedWithCHW } = require("../../utils/getTalkedWithCHW");
const { getHeardAboutUse } = require("../../utils/getHeardAboutUse");
const dayjs = require("dayjs");
const { generateOTP } = require("../../utils/generateOTP");
const {
  multiFactorEmail,
} = require("../../services/emailServices/multiFactorEmail");
const { createTransporter } = require('../../services/emailServices/transPorter');
const objectives = async (
  id,
  label,
  fromValue,
  value,
  modifiedById,
  createdById
) => {
  const latestEntry = await questionObjective
    .findOne({ clientId: id })
    .sort({ createdAt: -1 });

  if (latestEntry?.label === label && latestEntry.value === value) {
    return;
  } else {
    const logOfObjective = new questionObjective({
      clientId: id,
      label: label,
      fromValue: fromValue,
      value: value,
      modifiedBy: modifiedById,
      createdBy: createdById,
    });

    await logOfObjective.save();
  }
};

const objectivesOfCreate = async (id, label, fromValue, value, createdById) => {
  const logOfObjective = new questionObjective({
    clientId: id,
    label: label,
    fromValue: fromValue,
    value: value,
    createdBy: createdById,
  });
  await logOfObjective.save();
};

async function mapProfileQuestions(profileQuestions) {
  const mappedQuestions = await Promise.all(
    profileQuestions.map(async (questions) => {
      const { question, key, answers } = questions;
      let questionObject;
      if (answers && answers.length > 0) {
        // Check if answers is defined and not empty
        if (question?.startsWith("'") && question?.endsWith("'")) {
          const questionWithoutQuotes = question.slice(1, -1);
          questionObject = await profileQuestion.findOne({
            _id: questionWithoutQuotes,
          });
        } else {
          questionObject = await profileQuestion.findOne({ _id: question });
        }
        const data = {
          question: questionObject?._id,
          answer: answers.map((answer, index) => ({
            key: key[index]?.toString(),
            answer,
          })),
        };
        return data;
      } else {
        return null;
      }
    })
  );
  return mappedQuestions.filter((question) => question !== null); // Filter out null values
}

async function flagDuplicates(userLists) {
  const seen = new Set();

  const flaggedDuplicates = await Promise.all(
    userLists.map(async (user) => {
      const { birthDate, firstName, lastName } = user;

      const identifier = `${birthDate}-${firstName}-${lastName}`;

      if (seen.has(identifier)) {
        user.isDuplicate = true;
      } else {
        seen.add(identifier);
        user.isDuplicate = false;
      }

      try {
        await user.save();
      } catch (error) {
        console.error(`Error saving user ${user._id}:`, error);
      }

      return user;
    })
  );

  return flaggedDuplicates;
}

async function reassessment(userLists) {
  const today = dayjs().startOf("day");
  const flagAdded = await Promise.all(
    userLists.map(async (user) => {
      const { reassessmentDate } = user;
      const reassessmentDateParsed = dayjs(reassessmentDate).startOf("day");
      if (reassessmentDateParsed.isBefore(today)) {
        user.isReassessment = true;
      } else {
        user.isReassessment = false;
      }

      try {
        await user.save();
      } catch (error) {
        console.error(`Error saving user ${user._id}:`, error);
      }

      return user;
    })
  );

  return flagAdded;
}

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

function setReassessmentDate(createdAt) {
  const reassessmentDate = addMonths(createdAt, 3);
  return reassessmentDate;
}

function generateToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const newSignUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      zipCode,
      password,
      memberGroup,
    } = req.body;

    const findUser = await user.findOne({ email: email });
    // if (findUser) {
    //   return res.status(201).json({ status: false, message: "Email already exists" })
    // }

    const profileQuestions = req.body.profileQuestions;
    const mappedProfileQuestions = await mapProfileQuestions(profileQuestions);

    const setObjectives = [];
    await Promise.all(
      profileQuestions.map(async (question) => {
        const findQuestions = await profileQuestion.findOne({
          _id: question.question,
        });
        if (findQuestions?.category === "Housing") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "housingSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Healthcare") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "healthcareSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Food") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "foodSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Economic") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "economicSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Transportation") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "transportationSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Childcare") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "childcareSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Employment") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions?.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "employmentSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }

        if (findQuestions?.category === "Education") {
          const housingAnswers = question.answers;
          const housingValue = housingAnswers[0];

          const findQuestionAnswerValue = findQuestions.answers.answersML;
          findQuestionAnswerValue.forEach((questionObj) => {
            if (
              housingValue?.trim() === questionObj?.values?.en?.trim() ||
              housingValue?.trim() === questionObj?.values?.es?.trim()
            ) {
              setObjectives.push({
                label: "educationSecurity",
                value: questionObj.key !== "" ? questionObj.key : null,
              });
            }
          });
        }
        return setObjectives;
      })
    );

    let hashedPassword;
    if (password) {
      if (!password) {
        return res.status(400).json({ message: "Please enter password" });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)) {
        return res.status(400).json({
          message: "Please enter at least 1 lower 1 upper and 1 digint latter.",
        });
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newData = new user({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      Phone: phone?.trim(),
      password: hashedPassword ? hashedPassword : "",
      email: email?.trim(),
      zipCode: zipCode?.trim(),
      birthDate: birthDate,
      profileQuestion: await mappedProfileQuestions,
      objective: setObjectives,
      role: "Client",
      memberGroup: memberGroup,
    });
    newData.createdBy = newData._id;
    newData.profileQuestionBy = newData._id;
    await newData.save();

    const reassessmentDate = setReassessmentDate(newData.createdAt);
    newData.reassessmentDate = reassessmentDate;
    await newData.save();

    const fromValue = "N/A";

    await setObjectives.map((data) => {
      objectivesOfCreate(
        newData._id,
        data.label,
        fromValue,
        data.value,
        req.userId
      );
    });

    const profileQuestionHistoryData = await mapProfileQuestions(
      profileQuestions
    );
    const profileQuestionHistoryDatas = new profileQuestionHistory({
      profileQuestion: profileQuestionHistoryData.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
      clientId: newData._id,
      submittedBy: newData._id,
    });
    await profileQuestionHistoryDatas.save();

    return res.status(201).json({
      status: true,
      data: newData,
    });
  } catch (error) {
    console.log("err", error);
    return InternalServerError(res, error);
  }
};

//FOR REGISTER
const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      city,
      email,
      address,
      password,
      Phone,
      zipCode,
      birthDate,
      role,
      userName,
      visit_type,
      permissions,
      userId,
      requests,
      is_Verified,
      objective,
    } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: "Please enter first name" });
    }

    if (!lastName) {
      return res.status(400).json({ message: "Please enter last name" });
    }

    if (!email) {
      return res.status(400).json({ message: "Please enter email" });
    }

    const isUserEmailExist = await user.findOne({ email: email, role: "Super_Admin" });
    if (isUserEmailExist) {
      return AlreadyExistError(res, "Email");
    }

    let hashedPassword;
    if (password) {
      if (!password) {
        return res.status(400).json({ message: "Please enter password" });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)) {
        return res.status(400).json({
          message: "Please enter at least 1 lower 1 upper and 1 digint latter.",
        });
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newUser = new user({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      userName: userName?.trim(),
      address: address?.trim(),
      Phone: Phone?.trim(),
      zipCode: zipCode?.trim(),
      birthDate,
      requests,
      objective,
      password: hashedPassword ? hashedPassword : "",
      role: "Client", // public endpoint: never trust a client-supplied role
      city,
      visit_type,
      permissions,
      userId,
      is_Verified,
    });
    await newUser.save();

    // await sendVerifyEmale(newUser)
    res.status(201).json({
      status: true,
      message: "User Added",
      data: newUser,
    });
  } catch (error) {
    console.log("err", error);
    return InternalServerError(res, error);
  }
};

const sendPasswordResetEmail = async (email, token, user_name) => {
  let transporter = createTransporter;

  const resetLink = `${process.env.CURRENT_URL}/set-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Set Up Your Upstrem Health Account Password",
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
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// FOR CREATE CHW
const createChwAndClient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      userName,
      address,
      program,
      Phone,
      pa_id,
      birthDate,
      request_type,
      zipCode,
      role,
      is_Verified,
      visit_type,
      memberGroup,
      password,
      assign_to,
      isChw_Assign,
    } = req.body;
    let { objectivesOfProfile } = req.body;
    const userId = req.userId;
    if (!userId) {
      return UnauthorizedError(res, "User");
    }
    if (!firstName) {
      return res.status(400).json({ message: "Please enter first name" });
    }
    if (!lastName) {
      return res.status(400).json({ message: "Please enter last name" });
    }
    let hashedPassword;
    if (password) {
      if (!password) {
        return res.status(400).json({ message: "Please enter password" });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)) {
        return res.status(400).json({
          message: "Please enter at least 1 lower 1 upper and 1 digint latter.",
        });
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    objectivesOfProfile = [
      { label: "housingSecurity", value: "N/A" },
      { label: "foodSecurity", value: "N/A" },
      { label: "economicSecurity", value: "N/A" },
      { label: "transportationSecurity", value: "N/A" },
      { label: "childcareSecurity", value: "N/A" },
      { label: "employmentSecurity", value: "N/A" },
      { label: "educationSecurity", value: "N/A" },
      { label: "healthcareSecurity", value: "N/A" },
    ];

    let chwData;
    if (role === "CHW") {
      chwData = new user({
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        address: address?.trim(),
        zipCode: zipCode?.trim(),
        userName: userName?.trim(),
        Phone: Phone?.trim(),
        birthDate,
        email: email?.trim(),
        visit_type,
        objective: objectivesOfProfile,
        role,
        assign_to,
        pa_id: pa_id,
        isChw_Assign: isChw_Assign ? true : false,
        password: hashedPassword ? hashedPassword : "",
        is_Verified,
        createdBy: userId,
        memberGroup: memberGroup,
        isDetailCompleted: false,
      });
    } else {
      chwData = new user({
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        address: address?.trim(),
        zipCode: zipCode?.trim(),
        userName: userName?.trim(),
        Phone: Phone?.trim(),
        birthDate,
        email: email?.trim(),
        visit_type,
        objective: objectivesOfProfile,
        role,
        program: program,
        assign_to,
        isChw_Assign: isChw_Assign ? true : false,
        password: hashedPassword ? hashedPassword : "",
        is_Verified,
        createdBy: userId,
        memberGroup: memberGroup,
        isDetailCompleted: false,
      });
    }

    const user_name = chwData.firstName + " " + chwData.lastName;

    if (chwData.role === "CHW") {
      const token = generateToken();
      chwData.token = token;
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      chwData.token_expiry_time = now;
      sendPasswordResetEmail(chwData.email, token, user_name);
    }

    const assignToUser = await user.findById(assign_to);

    if (assignToUser) {
      chwData.assign_to = {
        _id: assignToUser._id,
        firstName: assignToUser.firstName,
        lastName: assignToUser.lastName,
      };
    }

    const newChw = await chwData.save();

    const reassessmentDate = setReassessmentDate(newChw.createdAt);
    chwData.reassessmentDate = reassessmentDate;
    await chwData.save();

    const populatedNewChw = await user
      .findById(newChw?._id)
      .populate("assign_to", "id firstName lastName");

    const fromValue = "N/A";

    await objectivesOfProfile.map(async (data) => {
      await objectivesOfCreate(
        newChw._id,
        data.label,
        fromValue,
        data.value,
        req.userId
      );
    });

    return res.status(200).json({
      status: true,
      message: "Chw created",
      data: populatedNewChw,
    });
  } catch (error) {
    console.log("error", error);
    return InternalServerError(res, error);
  }
};

const createClient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      userName,
      address,
      Phone,
      birthDate,
      request_type,
      memberGroup,
      zipCode,
      role,
      is_Verified,
      visit_type,
      password,
      assign_to,
      isChw_Assign,
    } = req.body;
    let { objectivesOfProfile } = req.body;

    if (!firstName) {
      return res.status(400).json({ message: "Please enter first name" });
    }
    if (!lastName) {
      return res.status(400).json({ message: "Please enter last name" });
    }
    if (!Phone) {
      return res.status(400).json({ message: "Please enter Phone number" });
    }
    if (!email) {
      return res.status(400).json({ message: "Please enter email" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter valid email" });
    }
    let hashedPassword;
    if (password) {
      if (!password) {
        return res.status(400).json({ message: "Please enter password" });
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)) {
        return res.status(400).json({
          message: "Please enter at least 1 lower 1 upper and 1 digint latter.",
        });
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    objectivesOfProfile = [
      { label: "housingSecurity", value: "N/A" },
      { label: "foodSecurity", value: "N/A" },
      { label: "economicSecurity", value: "N/A" },
      { label: "transportationSecurity", value: "N/A" },
      { label: "childcareSecurity", value: "N/A" },
      { label: "employmentSecurity", value: "N/A" },
      { label: "educationSecurity", value: "N/A" },
      { label: "healthcareSecurity", value: "N/A" },
    ];

    const chwData = new user({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      address: address?.trim(),
      zipCode: zipCode?.trim(),
      userName: userName?.trim(),
      Phone: Phone?.trim(),
      birthDate,
      memberGroup: memberGroup,
      email: email?.trim(),
      visit_type,
      objective: objectivesOfProfile,
      role: "Client", // public endpoint: never trust a client-supplied role
      assign_to,
      isChw_Assign: isChw_Assign ? true : false,
      password: hashedPassword ? hashedPassword : "",
      is_Verified,
      isDetailCompleted: false,
    });

    const user_name = chwData.firstName + " " + chwData.lastName;

    if (chwData.role === "CHW") {
      const token = generateToken();
      chwData.token = token;
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);
      chwData.token_expiry_time = now;
      sendPasswordResetEmail(chwData.email, token, user_name);
    }

    const assignToUser = await user.findById(assign_to);

    if (assignToUser) {
      chwData.assign_to = {
        _id: assignToUser._id,
        firstName: assignToUser.firstName,
        lastName: assignToUser.lastName,
      };
    }

    const newChw = await chwData.save();

    const reassessmentDate = setReassessmentDate(newChw.createdAt);
    chwData.reassessmentDate = reassessmentDate;
    await chwData.save();

    const populatedNewChw = await user
      .findById(newChw?._id)
      .populate("assign_to", "id firstName lastName");

    const fromValue = "N/A";

    await objectivesOfProfile.map(async (data) => {
      await objectivesOfCreate(
        newChw._id,
        data.label,
        fromValue,
        data.value,
        req.userId
      );
    });

    return res.status(200).json({
      status: true,
      message: "Chw created",
      data: populatedNewChw,
    });
  } catch (error) {
    console.log("error", error);
    return InternalServerError(res, error);
  }
};

const verifyAccessTimeLimit = async (req, res) => {
  try {
    const data = await user
      .findOne({ token: req.params.token, role: "CHW" })
      .lean();

    if (data?.is_set_pwd === true) {
      return res.status(403).json({
        status: false,
        message: "Using this link, Your password has been set.",
      });
    }

    if (!data) {
      return res.status(403).json({
        status: false,
        message: "The key has been expired. Please request for new one.",
      });
    }
    if (new Date(data?.timeLimitFogot) <= new Date()) {
      return res.status(403).json({
        status: false,
        message: "The key has been expired. Please request for new one.",
      });
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

const verifyForgetLink = async (req, res) => {
  try {
    const data = await user
      .findOne({ resetPasswordToken: req.params.token })
      .lean();
    if (!data) {
      return res.status(403).json({
        status: false,
        message:
          "The reset password link has expired. Please request a new link to reset your password.",
      });
    }
    if (data?.is_reset_pwd) {
      return res.status(403).json({
        status: false,
        message:
          "The reset password link has expired. Please request a new link to reset your password.",
      });
    }
    const verifyToken = jwt.verify(
      req?.params?.token,
      process.env.JWT_SECRETE_KEY
    );
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (verifyToken < currentTimestamp) {
      return res.status(403).json({
        status: false,
        message:
          "The reset password link has expired. Please request a new link to reset your password.",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Key verified",
    });
  } catch (error) {
    return res.status(403).json({
      status: false,
      message:
        "The reset password link has expired. Please request a new link to reset your password.",
    });
  }
};

const setPassword = async (req, res) => {
  try {
    const users = await user.findOne({ token: req.body.token, role: "CHW" });

    if (!users) {
      return res.status(403).json({
        status: false,
        message: "User not found",
      });
    }

    let hashedPassword;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await user.findOneAndUpdate(
      { token: req.body.token },
      { $set: { password: hashedPassword, is_set_pwd: true } },
      { new: true }
    );

    // await users.save();
    return res.status(201).json({
      status: true,
      message: "Password Reset successfully. Please try to login.",
      data: updatedUser,
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

const updateOneUser = async (filter, reflection) => {
  const options = {
    upsert: false,
    returnOriginal: false,
  };

  let result = user.findOneAndUpdate(filter, reflection, options).lean();

  return await result.lean();
};

const ChangePassword = async (req, res) => {
  try {
    const { password, userId, token } = req.body;
    const findUser = await user.findOne({ _id: userId });
    if (findUser.is_reset_pwd) {
      return res.status(403).json({
        status: false,
        message:
          "The reset password link has expired. Please request a new link to reset your password.",
      });
    }
    const isValidToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    let hashedPassword;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    hashedPassword = await bcrypt.hash(password, salt);
    const data = await user.findByIdAndUpdate(
      userId,
      { password: hashedPassword, is_reset_pwd: true },
      { new: true }
    );
    return res
      .status(200)
      .json({ status: true, message: "Password successfully updated!" });
  } catch (error) {
    return res.status(401).json({
      status: false,
      message:
        "The reset password link has expired. Please request a new link to reset your password.",
    });
  }
};

//FOR VERIFY USER
const verifyEmail = async (req, res) => {
  try {
    const { id } = req.body;
    const updateUser = await user.findByIdAndUpdate(id, {
      $set: { is_Verified: true },
    });
    return res.status(200).json({
      status: true,
      message: "Email verified successfully",
      data: updateUser,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

//FOR LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email.toLowerCase();

    if (!email && !userName) {
      return res.json({ message: "Please enter email or userName" });
    }

    if (!password) {
      return res.json({ message: "Please enter password" });
    }

    let isUserExist;

    if (role === "Super_Admin") {
      isUserExist = await user.findOne({ email: normalizedEmail, role: role });
    } else {
      isUserExist = await user.findOne({
        email: normalizedEmail,
        role: { $ne: "Super_Admin" },
      });
    }

    if (!isUserExist) {
      return res.status(401).json({
        status: false,
        message: "Invalid Email or Password"
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid Email or Password"
      })
    }

    // if (isUserExist?.is_Verified !== true) {
    //   return res.status(401).json({ status: false, message: "Verify your email to unlock all features. Check your email inbox" })
    // }

    // const token = jwt.sign({ user: isUserExist }, process.env.JWT_SECRETE_KEY);

    filter = {
      email: isUserExist.normalizedEmail,
    };

    const ref1 = {
      $set: {
        lastLoginTime: new Date(),
      },
    };
    await updateOneUser(filter, ref1);

    const otp = generateOTP(isUserExist._id);
    const otpExpiryTime = dayjs().add(10, "minute").toDate();

    await user.findOneAndUpdate(
      { _id: isUserExist._id },
      { $set: { otp: otp, otp_expiry_time: otpExpiryTime } },
      { new: true }
    );

    await multiFactorEmail(isUserExist, otp);

    return res
      .status(200)
      .json({ status: true, message: "Login success", data: { email } });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

//FOR GET ALL
const getAllUser = async (req, res) => {
  try {
    let userLists = [];
    const userId = req.userId;
    if (!userId) {
      return UnauthorizedError(res, "User");
    }

    const validUser = await user.findById(userId);
    let query = { _id: { $ne: userId } };

    if (validUser?.role === "Super_Admin") {
    } else if (validUser?.role === "Program_Administrator") {
    } else if (validUser?.role === "CHW") {
      query = { assign_to: userId };
    } else {
      return NotAccessError(res, "You don't have access");
    }

    query.isArchive = false;
    userLists = await user
      .find(query)
      .sort({ createdAt: -1 })
      .populate("assign_to");

    return res.status(200).json({
      status: true,
      message: "List of all users",
      data: {
        userLists: userLists,
        totalCount: userLists?.length,
      },
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

// Filter and get all clients
const getAllClients = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return UnauthorizedError(res, "User");
    }

    const { zipCode, byCHW, status, role, search } = req.body.filter || {};
    const { page, limit } = req.body?.pagination;

    const query = { isArchive: false };

    if (role) {
      query.role = role;
    }

    if (zipCode) {
      query.zipCode = zipCode;
    }

    if (byCHW) {
      query.assign_to = byCHW;
    }

    if (status) {
      query.status = status;
    }

    const validUser = await user.findById(userId);

    if (!validUser) {
      return NotAccessError(res, "User not found");
    }

    const paProgram = validUser.pa_program;

    if (validUser?.role === "Super_Admin") {
      query.role = { $nin: ["Super_Admin", "Program_Administrator", "CHW"] };
    } else if (validUser?.role === "Program_Administrator") {
      query.role = { $nin: ["Super_Admin", "Program_Administrator", "CHW"] };
    } else if (validUser?.role === "CHW") {
      query.role = { $nin: ["Super_Admin", "Program_Administrator"] };
      query.role = { $in: ["Client"] };
      query.assign_to = userId;
    } else {
      return NotAccessError(res, "You don't have access");
    }

    if (search) {
      const nameRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: nameRegex },
        { lastName: nameRegex },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: nameRegex,
            },
          },
        },
      ];
    }

    const totalUsersCount = await user.countDocuments(query); // Get the total count of documents

    let userLists = await user
      .find({ ...query, role: "Client" })
      .sort({ createdAt: -1 })
      .populate("assign_to", "firstName lastName _id")
      .populate("profileQuestion.question");

    if (validUser?.role === "Super_Admin") {
    } else if (
      validUser?.role === "Program_Administrator" &&
      Array.isArray(paProgram)
    ) {
      userLists = userLists.filter((user) => paProgram.includes(user.program));
    } else if (validUser?.role === "CHW") {
      const paData = await user.findOne({ _id: validUser.pa_id });
      const programs = paData.pa_program;

      if (Array.isArray(programs)) {
        userLists = userLists.filter(
          (users) => users?.program && programs.includes(users?.program)
        );
      }
    }

    await flagDuplicates(userLists);
    await reassessment(userLists);

    let newArray = [];

    const PendingUserCount = userLists.filter((v) => v?.status === "Pending");
    const openUserCount = userLists.filter((v) => v?.status === "Open");
    const inProgressUserCount = userLists.filter(
      (v) => v?.status === "InProgress"
    );
    const ClosedInactiveUserCount = userLists.filter(
      (v) => v?.status === "Closed-Inactive"
    );
    const ClosedSucceUserCount = userLists.filter(
      (v) => v?.status === "Closed-Success"
    );

    if (status === "Closed-Success") {
      newArray = [...ClosedSucceUserCount];
    } else if (status === "Closed-Inactive") {
      newArray = [...ClosedInactiveUserCount];
    } else {
      newArray = [
        ...PendingUserCount,
        ...openUserCount,
        ...ClosedSucceUserCount,
        ...ClosedInactiveUserCount,
      ];
    }

    newArray.forEach((user) => {
      if (user.profileQuestion.every((q) => typeof q !== "object")) {
        user.isDetailCompleted = false;
      }
    });

    const startIndex = (page - 1) * limit;
    const paginatedArray = newArray.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      status: true,
      data: {
        userLists: paginatedArray,
        totalUsersCount: userLists.length,
        totalPages: Math.ceil(totalUsersCount / limit),
        currentPage: page,
        PendingUserCount: PendingUserCount.length,
        openUserCount: openUserCount.length,
        inProgressUserCount: inProgressUserCount.length,
        ClosedInactiveUserCount: ClosedInactiveUserCount.length,
        ClosedSucceUserCount: ClosedSucceUserCount.length,
      },
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR GET ALL CHW CLIENT LIST
const getChwClientList = async (req, res) => {
  try {
    let userLists = [];
    const userId = req?.query?.id;

    if (!userId) {
      return UnauthorizedError(res, "User");
    }

    const validUser = await user.findById(userId);
    let query = { _id: { $ne: userId } };

    if (validUser?.role === "CHW") {
      query.assign_to = userId;
    } else {
      return NotAccessError(res, "You don't have access");
    }
    query.isArchive = false;

    userLists = await user
      .find(query)
      .sort({ createdAt: -1 })
      .select("firstName lastName _id");

    userLists = await Promise.all(
      userLists.map(async (user) => {
        const taskCount = await taskClient.countDocuments({
          clientId: user._id,
          isArchive: false,
        });
        const requestCount = await request.countDocuments({
          request_by: user._id,
          isArchive: false,
        });

        return {
          user,
          taskCount,
          requestCount,
        };
      })
    );

    const totalUsersCount = userLists?.length;

    return res.status(200).json({
      status: true,
      message: "List of all users",
      data: {
        userLists,
        totalUsersCount,
      },
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR GET ALL CHW
const getAllChw = async (req, res) => {
  try {
    let userLists = [];
    const userId = req.userId;
    const search = req.body;
    if (!userId) {
      return UnauthorizedError(res, "User");
    }

    const validUser = await user.findById(userId);
    let query = { _id: { $ne: userId } };

    if (validUser?.role === "Super_Admin") {
      // query.role = { $ne: "Super_Admin" };
      query.role = "CHW";
    } else if (validUser?.role === "Program_Administrator") {
      query.role = { $ne: "Super_Admin" };
      query.role = "CHW";
    } else {
      return NotAccessError(res, "You don't have access");
    }
    query.isArchive = false;

    if (typeof search === "string" && search?.trim() !== "") {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    userLists = await user
      .find(query)
      .sort({ createdAt: -1 })
      .populate("assign_to")
      .populate("pa_id", "firstName lastName isArchive _id");

    const enhancedUsers = await Promise.all(
      userLists.map(async (user) => {
        if (user?.pa_id && user?.pa_id?.isArchive === true) {
          await userModel.findOneAndUpdate(
            { _id: user._id },
            { $set: { pa_id: null } },
            { new: true }
          );
        }

        const [userCount, requestCount, taskCount] = await Promise.all([
          userModel.countDocuments({ assign_to: user._id, isArchive: false }),
          request.countDocuments({
            assign_to: user._id,
            request_status: "Pending",
            isArchive: false,
          }),
          taskClient.countDocuments({
            assign_to: user._id,
            "task.status": "Pending",
            isArchive: false,
          }),
        ]);

        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user._id,
          assignedPA: `${user?.pa_id?.firstName} ${user?.pa_id?.lastName}`,
          userCount,
          requestCount,
          taskCount,
        };
      })
    );

    const totalUsersCount = userLists?.length;
    return res.status(200).json({
      status: true,
      message: "List of all users",
      data: {
        userLists: userLists,
        totalUsersCount,
        enhancedUsers,
      },
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR  SEARCH USER
const searchUser = async (req, res) => {
  try {
    const userId = req.userId;
    const searchParameter = req.query.search;
    const zipCode = req?.body?.filter?.zipCode;
    const assign_to = req?.body?.filter?.byCHW;
    const status = req?.body?.filter?.status;
    const role = req?.body?.filter?.role ? req?.body?.filter?.role : "";
    let searchQuery = {
      $and: [],
    };
    searchQuery.$and.push({ role: role });
    if (zipCode) {
      searchQuery.$and.push({ zipCode: zipCode });
    }
    if (assign_to) {
      searchQuery.$and.push({ assign_to: assign_to });
    }
    if (status) {
      searchQuery.$and.push({ status: status });
    }

    const validUser = await user.findById(userId);
    if (validUser?.role === "Program_Administrator") {
      // No additional conditions for Program_Administrator
    } else if (validUser?.role === "CHW") {
      searchQuery.assign_to = userId;
    }

    // Merge conditions for firstName and lastName
    searchQuery.$and.push({
      $or: [
        { firstName: { $regex: searchParameter, $options: "i" } },
        { lastName: { $regex: searchParameter, $options: "i" } },
      ],
    });

    searchQuery.isArchive = false;
    const userData = await user
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .populate("assign_to")
      .populate("createdBy");
    return res
      .status(200)
      .json({ status: true, message: "Users found", data: userData });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

const searchClient = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return UnauthorizedError(res, "User");
    }

    const searchParameter = req.query.search;

    const validUser = await user.findById(userId);
    let query = {
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      isArchive: false,
    };
    if (validUser?.role === "Super_Admin") {
    } else if (validUser?.role === "Program_Administrator") {
      query.role = { $nin: ["Super_Admin", "Program_Administrator", "CHW"] };
    } else if (validUser?.role === "CHW") {
      query.role = { $in: ["Client", "CHW"] };
      query.$or = [{ assign_to: new mongoose.Types.ObjectId(userId) }];
    } else {
      return NotAccessError(res, "You don't have access");
    }

    query.$or = [
      { firstName: { $regex: searchParameter, $options: "i" } },
      { lastName: { $regex: searchParameter, $options: "i" } },
      { email: { $regex: searchParameter, $options: "i" } },
      { Phone: { $regex: searchParameter, $options: "i" } },
    ];

    const userData = await user
      .find(query)
      .sort({ createdAt: -1 })
      .populate("assign_to")
      .populate("createdBy");

    return res
      .status(200)
      .json({ status: true, message: "Users found", data: userData });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR SEARCH ALL CLIENTS
const searchChw = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "You don't have an access" });
    }

    const searchParameter = req.query.search;
    let searchQuery = {};

    searchQuery.$or = [
      { firstName: { $regex: searchParameter, $options: "i" } },
      { lastName: { $regex: searchParameter, $options: "i" } },
    ];

    searchQuery.isArchive = false;

    const userData = await user
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .populate("assign_to")
      .populate("createdBy");
    const filteredData = userData?.filter((v) => v?.role === "CHW");

    return res
      .status(200)
      .json({ status: true, message: "Users found", data: filteredData });
  } catch (error) {
    console.log(error);
    return InternalServerError(res, error);
  }
};

//FOR SEARCH ALL CLIENTS
const searchChwClient = async (req, res) => {
  try {
    const userId = req.userId;
    const chwid = req.body.id;

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    const searchParameter = req.query.search;
    let searchQuery = { assign_to: chwid, isArchive: false };

    searchQuery.$or = [
      { firstName: { $regex: searchParameter, $options: "i" } },
      { lastName: { $regex: searchParameter, $options: "i" } },
    ];

    const userData = await user
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .populate("assign_to")
      .populate("createdBy");
    const filteredData = userData?.filter((v) => v?.role === "Client");

    const userLists = await Promise.all(
      filteredData.map(async (user) => {
        const taskCount = await taskClient.countDocuments({
          clientId: user._id,
          isArchive: false,
        });
        const requestCount = await request.countDocuments({
          request_by: user._id,
          isArchive: false,
        });

        return {
          user,
          taskCount,
          requestCount,
        };
      })
    );

    const totalUsersCount = userLists?.length;

    return res.status(200).json({
      status: true,
      message: "Users found",
      data: {
        userLists,
        totalUsersCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

//FOR GET USER DETAILS
const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    let userData = await user
      .findById(userId)
      .populate("profileQuestion.question", "questionML answers")
      .populate("assign_to");

    return res
      .status(200)
      .json({ status: true, message: "User found", data: userData });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const validUserId = req.userId;
    const userId = req.query.id;

    if (!userId || !isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide a correct ID" });
    }

    if (!validUserId) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized user" });
    }

    if (!userId) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let userData = await user
      .findOne({ _id: userId, isArchive: false })
      .populate(
        "profileQuestion.question",
        "questionML answers short_desc selected sequence"
      )
      .populate("assign_to")
      .populate({
        path: "profileQuestionBy",
        select: "firstName lastName",
      })
      .populate({
        path: "pa_id",
        select: "firstName lastName isArchive _id",
      });

    if (userData?.pa_id && userData.pa_id.isArchive === true) {
      await user.updateOne(
        { _id: userId },
        { $set: { pa_id: null } },
        { new: true }
      );
      userData.pa_id = "";
    }

    userData?.modifiedProfileQuestions.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    if (userData?.modifiedProfileQuestions.length > 0) {
      const latestModification = userData.modifiedProfileQuestions[0];
      const latestModifiedBy = await user
        .findById(latestModification.modifiedBy)
        .select("firstName lastName");
      userData.modifiedProfileQuestions[0].modifiedBy = latestModifiedBy;
    }

    userData = userData?.toObject();
    const clients = await user.find({ assign_to: userId });
    const requests = await request.find({ assign_to: userId });
    const tododata = await todos.find({ assign_to: userId });
    // userData.clientCount = clients?.length;
    userData.requestCount = requests?.length;
    userData.todoCount = tododata?.length;

    return res
      .status(200)
      .json({ status: true, message: "User found", data: userData });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
      error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let file = req.file;
    let userData = { ...req.body };
    const userId = req.userId;
    const id = req.query.id;

    // if (!Array.isArray(id) || !id.every(isValidObjectId)) {
    //   return res.status(400).json({ status: false, message: "Please provide a correct ID" });
    // }

    if (!userId) {
      return res
        .status(401)
        .json({ status: "fail", message: "Unauthorized user" });
    }

    if (!id) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    if (req?.body?.assign_to) {
      await request.updateMany(
        { request_by: id },
        { assign_to: req?.body?.assign_to },
        { new: true }
      );
      await visit.updateMany(
        { clientId: id },
        { assign_to: req?.body?.assign_to },
        { new: true }
      );
    }

    const userRecord = await user.findOne({ _id: id });

    // const value = userData.objective.map(data => data.value)

    if (req.body.profileQuestion) {
      if (!userRecord.profileQuestionBy) {
        userData.profileQuestionBy = req.userId;
      } else {
        userRecord.modifiedProfileQuestions.push({
          modifiedBy: req.userId,
          createdAt: new Date(),
        });
        userData.modifiedProfileQuestions = userRecord.modifiedProfileQuestions;
      }
      userData.profileQuestion = req.body.profileQuestion?.map((question) => ({
        question: question.question,
        answer: question.answers.map((answer, index) => ({
          key: question.keys[index],
          answer,
        })),
      }));

      userData.isDetailCompleted = userData.profileQuestion.every(
        (item) => typeof item === "object"
      );
    }

    const findInModel = await profileQuestionHistory.findOne({ clientId: id });

    if (!findInModel) {
      const storeInHistory = new profileQuestionHistory({
        profileQuestion: req.body.profileQuestion?.map((question) => ({
          question: question.question,
          answer: question.answers.map((answer, index) => ({
            key: question.keys[index],
            answer,
          })),
        })),
        clientId: id,
        submittedBy: req.userId,
        modifiedBy: req.userId,
      });
      await storeInHistory.save();
    } else {
      findInModel.modifiedBy = req.userId;
      await findInModel.save();
    }

    if (req.body.profileQuestion) {
      const setObjectives = [];
      await Promise.all(
        (req.body.profileQuestion ?? []).map(async (question) => {
          const findQuestions = await profileQuestion.findOne({
            _id: question.question,
          });

          const categoryObjectives = [];

          if (findQuestions?.category === "Housing") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "housingSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Healthcare") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "healthcareSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Food") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "foodSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Economic") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "economicSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Transportation") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;

            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "transportationSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Childcare") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "childcareSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Employment") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "employmentSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          if (findQuestions?.category === "Education") {
            const housingAnswers = question.answers;
            const housingValue = housingAnswers[0];

            const findQuestionAnswerValue = findQuestions.answers.answersML;
            findQuestionAnswerValue.forEach((questionObj) => {
              if (
                housingValue?.trim() === questionObj?.values?.en?.trim() ||
                housingValue?.trim() === questionObj?.values?.es?.trim()
              ) {
                categoryObjectives.push({
                  label: "educationSecurity",
                  value: questionObj.key !== "" ? questionObj.key : null,
                });
              }
            });
          }

          setObjectives.push(...categoryObjectives);
        })
      );

      const uniqueObjectives = setObjectives.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((o) => o.label === obj.label && o.value === obj.value)
      );

      await Promise.all(
        userRecord?.objective?.map(async (data) => {
          const matchingObjective = uniqueObjectives.find(
            (obj) => obj.label === data?.label
          );
          if (matchingObjective) {
            await objectives(
              id,
              matchingObjective.label,
              data.value,
              matchingObjective.value,
              req.userId
            );
          }
        })
      );

      userData.objective = setObjectives.filter((obj) => obj !== undefined);
    }

    if (req.body.objective) {
      const newArray = await Promise.all(
        userRecord?.objective?.map(async (data) => {
          if (
            req.body.objective &&
            data.label === req.body.objective[0]?.label
          ) {
            const fromValue = data.value;
            await objectives(
              id,
              req.body.objective[0].label,
              fromValue,
              req.body.objective[0].value,
              req.userId
            );
            data.value = req.body.objective[0].value;
            return data;
          } else {
            return data;
          }
        })
      );

      userData.objective = newArray;
    }

    if (req.body.isReassessment === true) {
      userData.reassessmentDate = new Date();
      userData.isReassessment = true;
    }

    // Update the user data
    let updatedUserData = await user
      .updateMany({ _id: id }, { $set: userData }, { new: true })
      .populate("profileQuestion.question", "questionML answers short_desc")
      .populate({
        path: "assign_to",
        select: "firstName lastName _id",
      })
      .populate({
        path: "pa_id",
        select: "firstName lastName _id",
      });

    if (req.body.reason) {
      const statusHistory = new clientStatusHistoryModel({
        clientId: id,
        newstatus: req.body.status,
        oldStatus: req.body.oldStatus,
        statusReason: req.body.reason,
        modifiedBy: req.userId,
      });
      await statusHistory.save();
    }

    // Handle profile image operations
    let flagUpdateImage = false;
    let image = false;

    if (updatedUserData?.profileImage) {
      if (file) {
        deleteFile(updatedUserData?.profileImage);
        flagUpdateImage = true;
        image = file?.location;
      } else if (req?.body?.deleteProfileImage) {
        deleteFile(updatedUserData?.profileImage);
        flagUpdateImage = true;
      }
    } else if (file) {
      flagUpdateImage = true;
      image = file?.location;
    }

    let reflection = { $set: {}, $unset: {} };
    if (flagUpdateImage) {
      if (image) {
        reflection.$set.profileImage = image;
      } else {
        reflection.$unset = {
          profileImage: 1,
        };
      }
    }

    // Update the user data with profile image changes
    updatedUserData = await user
      .updateMany({ _id: id }, reflection, { new: true })
      .populate(
        "profileQuestion.question",
        "questionML answers short_desc selected sequence"
      )
      .populate({
        path: "assign_to",
        select: "firstName lastName _id",
      })
      .populate({
        path: "pa_id",
        select: "firstName lastName _id",
      });
    delete req?.body?.deleteProfileImage;

    const usersss = await user
      .findOne({ _id: id })
      .populate(
        "profileQuestion.question",
        "questionML answers short_desc selected sequence"
      )
      .populate({
        path: "assign_to",
        select: "firstName lastName _id",
      })
      .populate({
        path: "pa_id",
        select: "firstName lastName _id",
      });

    return res
      .status(200)
      .json({ status: true, message: "User updated", data: usersss });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      status: false,
      message: "Error occurred while updating user",
      error,
    });
  }
};

//FOR DELETE USER
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide a correct ID" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ status: true, message: "Unauthorized user" });
    }
    if (!id) {
      return res.status(404).json({ status: true, message: "User not found" });
    }
    const deletedUser = await user.findByIdAndUpdate(id, { isArchive: true });
    const deleteRequest = await request.updateMany(
      {
        request_by: id,
      },
      {
        $set: { isArchive: true },
      },
      { new: true }
    );

    const deleteVisit = await visit.updateMany(
      {
        clientId: id,
      },
      {
        $set: { isArchive: true },
      },
      { new: true }
    );

    const deleteTask = await taskClient.updateMany(
      {
        clientId: id,
      },
      {
        $set: { isArchive: true },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "User deleted",
      data: deletedUser,
      deleteRequest,
      deleteVisit,
      deleteTask,
    });
  } catch (error) {
    console.log("error :", error);
    return res.status(500).json({
      status: true,
      message: "Error occurred while updating user",
      error,
    });
  }
};

//FOR DELETE MULTIPLE USER
const deleteMultiUser = async (req, res) => {
  try {
    const ids = req.body.ids;

    const deleteUser = await user.deleteMany({ _id: { $in: ids } });

    if (deleteUser) {
      return res.status(200).json({
        status: true,
        message: "Selected todos deleted successfully",
      });
    }
  } catch (error) {
    return InternalServerError(res, error);
  }
};

//FORGET PWD
const forgetPwd = async (req, res) => {
  try {
    const { email } = req.body
    if (typeof email !== "string" || !email) {
      return res.status(400).json({ status: false, message: "Please enter email" });
    }
    const normalizedEmail = email.toLowerCase();

    const findUser = await user.findOne({ email: normalizedEmail });
    if (findUser) {
      const token = await jwt.sign(
        { id: findUser._id },
        process.env.JWT_SECRETE_KEY,
        { expiresIn: "24h" }
      );
      await user.findByIdAndUpdate(findUser._id, {
        resetPasswordToken: token,
        is_reset_pwd: false,
      });
      forgetPasswordMail(findUser, token);
    }
    // same response whether or not the account exists, so emails can't be enumerated
    return res.status(200).json({
      status: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id || !isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide a correct ID" });
    }

    const { oldPassword, newPassword } = req.body;

    const users = await user.findOne({ _id: id });

    if (!users) {
      return res.status(403).json({ status: false, message: "User not found" });
    }

    const isMatchOldPwd = await bcrypt.compare(oldPassword, users.password);
    if (!isMatchOldPwd) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid Current Password." });
    }

    const isMatchNewPwd = await bcrypt.compare(newPassword, users.password);
    if (isMatchNewPwd) {
      return res.status(403).json({
        status: false,
        message: "Your new password cannot be the same as the old one.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await user.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Password updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const getUserByActive = async (req, res) => {
  try {
    const userId = req.userId;
    const loginUser = await user.findById(userId);
    let totalUser = await user.countDocuments({
      isArchive: false,
      role: "Client",
    });

    let aggregationPipeline = [
      {
        $match: {
          isArchive: false,
          role: "Client",
          status: "Open",
        },
      },
    ];

    if (loginUser?.role === "Super_Admin") {
    } else if (
      loginUser?.role === "Program_Administrator" &&
      Array.isArray(loginUser.pa_program)
    ) {
      aggregationPipeline.push({
        $match: {
          $or: [{ program: { $in: loginUser.pa_program } }],
        },
      });
    } else if (loginUser?.role === "CHW") {
      totalUser = await user.countDocuments({
        isArchive: false,
        assign_to: userId,
      });
      aggregationPipeline.push({
        $match: {
          assign_to: new mongoose.Types.ObjectId(userId),
        },
      });

      const paData = await user.findOne({ _id: loginUser.pa_id });
      const programs = paData?.pa_program || [];

      if (Array.isArray(programs)) {
        aggregationPipeline.push({
          $match: {
            program: { $in: programs },
          },
        });
      }
    }

    const aggregationResult = await user.aggregate(aggregationPipeline);
    const data = aggregationResult.length;

    return res.status(200).json({
      status: true,
      message: "User data retrieved successfully!",
      data: {
        data,
        totalUser,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserByTime = async (req, res) => {
  try {
    const userId = req.userId;
    const loginUser = await user.findById(userId);
    let count;

    if (loginUser?.role === "Super_Admin") {
      count = await user.countDocuments({
        isArchive: false,
        status: "Pending",
        role: "Client",
      });
    } else if (
      loginUser?.role === "Program_Administrator" &&
      Array.isArray(loginUser.pa_program)
    ) {
      count = await user.countDocuments({
        isArchive: false,
        status: "Pending",
        role: "Client",
        $or: [{ program: { $in: loginUser.pa_program } }],
      });
    } else if (loginUser?.role === "CHW") {
      const paData = await user.findOne({ _id: loginUser.pa_id });
      const programs = paData?.pa_program || [];

      count = await user.countDocuments({
        isArchive: false,
        assign_to: userId,
        status: "Pending",
        role: "Client",
        program: { $in: programs },
      });
    } else {
      count = await user.countDocuments({
        isArchive: false,
        status: "Pending",
        role: { $nin: ["Super_Admin", "Program_Administrator", "CHW"] },
      });
    }

    return res.status(200).json({
      status: true,
      message: "User data retrieved successfully!",
      data: { count },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//FOR REGISTER
const profileHistory = async (req, res) => {
  try {
    const userProfileHistory = await profileQuestionHistory
      .findOne({ clientId: req.query.clientId })
      .populate("profileQuestion.question")
      .populate({
        path: "submittedBy",
        select: "firstName lastName",
      })
      .populate({
        path: "modifiedBy",
        select: "firstName lastName",
      });

    res.status(200).json({
      status: true,
      message: "User profileQuetion history",
      data: userProfileHistory,
    });
  } catch (error) {
    console.log("err", error);
    return InternalServerError(res, error);
  }
};

const listAndSerchCHW = async (req, res) => {
  try {
    const userId = req.userId;
    const { search } = req.body;
    const role = "CHW";

    let query = {};

    if (req.role === "Super_Admin") {
      query = { role: role, isArchive: false };
    } else if (req.role === "Program_Administrator") {
      query = { role: role, isArchive: false, pa_id: userId };
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ];
    }

    const users = await user.find(query).select("firstName lastName _id");

    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        const [userCount, requestCount] = await Promise.all([
          userModel.countDocuments({ assign_to: user._id, isArchive: false }),
          request.countDocuments({
            assign_to: user._id,
            request_status: "Pending",
            isArchive: false,
          }),
        ]);

        return {
          label: `${user.firstName} ${user.lastName}`,
          value: user._id,
          userCount,
          requestCount,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: enhancedUsers,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving users",
      error: error.message,
    });
  }
};

const listAndSerchUser = async (req, res) => {
  try {
    const { search } = req.body;
    const role = "Client";

    let query = { role: role, isArchive: false };

    if (search) {
      const nameRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: nameRegex },
        { lastName: nameRegex },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: nameRegex,
            },
          },
        },
      ];
    }
    const users = await user.find(query).select("firstName lastName _id");

    const formattedUsers = users.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user._id,
    }));

    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: formattedUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving users",
      error: error.message,
    });
  }
};

const listAndSerchZipCode = async (req, res) => {
  try {
    const { search } = req.body;

    let query = {};
    if (search) {
      query = { zipCode: { $regex: new RegExp(search, "i") } };
    }

    query.isArchive = false;
    const uniqueZipCodes = await user.distinct("zipCode", query);

    const filteredZipCodes = uniqueZipCodes.filter((zipCode) => zipCode !== "");

    const formattedUsers = filteredZipCodes.map((user) => ({
      label: `${user}`,
      value: user,
    }));

    return res.status(200).json({
      status: true,
      message: "Zip codes retrieved successfully",
      data: formattedUsers,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listAndSerchResourceGiven = async (req, res) => {
  try {
    const { search } = req.body;

    let query = {
      isArchive: false,
    };

    if (search) {
      query.$or = [
        { resource_name: { $regex: new RegExp(search, "i") } },
        { organization: { $regex: new RegExp(search, "i") } },
      ];
    }

    const users = await resourceGiven
      .find(query)
      .select("resource_name _id organization");

    const formattedUsers = users.map((user) => ({
      label: `${user.resource_name} (${user.organization})`,
      value: user._id,
    }));

    return res.status(200).json({
      status: true,
      message: "Zip codes retrieved successfully",
      data: formattedUsers,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listAssignedClient = async (req, res) => {
  try {
    const { search } = req.body;

    let userQuery = { role: "Client" };
    if (search) {
      userQuery.$or = [
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ];
    }

    const clients = await user.find(userQuery).select("firstName lastName _id");
    const clientIds = clients.map((client) => client._id);

    const requests = await request
      .find({
        assign_to: { $in: clientIds },
        isArchive: false,
      })
      .select("assign_to");

    const filteredClientIds = [
      ...new Set(requests.map((req) => req.assign_to.toString())),
    ];
    const filteredClients = clients.filter((client) =>
      filteredClientIds.includes(client._id.toString())
    );

    const formattedClients = filteredClients.map((client) => ({
      label: `${client.firstName} ${client.lastName}`,
      value: client._id,
    }));

    return res.status(200).json({
      status: true,
      message: "Clients retrieved successfully",
      data: formattedClients,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const chwAssign = async (req, res) => {
  try {
    const id = req.body.id;
    const userData = { ...req.body };
    const userIds = id.map((id) => new mongoose.Types.ObjectId(id));

    await user.updateMany(
      { _id: { $in: userIds } },
      { $set: userData },
      { new: true }
    );

    const displayData = await user.find({ _id: { $in: id } }).populate({
      path: "assign_to",
      select: "firstName lastName _id",
    });

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: displayData,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listLanaguage = async (req, res) => {
  try {
    const listData = await profileQuestion.findOne({
      "short_desc.value": "Language",
      isArchive: false,
    });

    const answersML = listData?.answers?.answersML?.map((item) => ({
      label: item.values.en,
      value: item.values.en,
    }));

    return res
      .status(200)
      .json({ status: true, message: "Data found", data: answersML });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listEthinicty = async (req, res) => {
  try {
    const listData = await profileQuestion.findOne({
      "short_desc.value": "Race/Ethnicity",
      isArchive: false,
    });

    const answersML = listData?.answers?.answersML?.map((item) => ({
      label: item.values.en,
      value: item.values.en,
    }));

    return res
      .status(200)
      .json({ status: true, message: "Data found", data: answersML });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listPrononuce = async (req, res) => {
  try {
    const listData = await profileQuestion.findOne({
      "short_desc.value": "Pronouns",
      isArchive: false,
    });

    const answersML = listData?.answers?.answersML?.map((item) => ({
      label: item.values.en,
      value: item.values.en,
    }));

    return res
      .status(200)
      .json({ status: true, message: "Data found", data: answersML });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const listDuplicateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await user
      .findById(userId)
      .populate("assign_to", "firstName lastName _id")
      .populate("profileQuestion.question")
      .lean();
    if (!userData) {
      return res.status(403).json({ message: "User not found" });
    }

    const duplicateUsers = await user
      .find({
        _id: { $ne: userData._id },
        firstName: userData.firstName,
        lastName: userData.lastName,
        isArchive: false,
        birthDate: userData.birthDate,
      })
      .populate("assign_to", "firstName lastName _id")
      .populate("profileQuestion.question")
      .lean();

    let isPhoneConflict = false;
    let isEmailConflict = false;
    let isAddressConflict = false;
    let isZipCodeConflict = false;
    let isAssignToConflict = false;
    let isStatusConflict = false;
    let isTalkedWithCHWConflict = false;
    let isHeardAboutUsConflict = false;

    for (const duplicateUser of duplicateUsers) {
      if (
        duplicateUser.Phone &&
        userData.Phone &&
        duplicateUser.Phone !== userData.Phone
      )
        isPhoneConflict = true;
      if (
        duplicateUser.email &&
        userData.email &&
        duplicateUser.email !== userData.email
      )
        isEmailConflict = true;
      if (
        duplicateUser.address &&
        userData.address &&
        duplicateUser.address !== userData.address
      )
        isAddressConflict = true;
      if (
        duplicateUser.zipCode &&
        userData.zipCode &&
        duplicateUser.zipCode !== userData.zipCode
      )
        isZipCodeConflict = true;
      if (duplicateUser.assign_to?._id !== userData.assign_to?._id)
        isAssignToConflict = true;
      if (
        duplicateUser.status &&
        userData.status &&
        duplicateUser.status !== userData.status
      )
        isStatusConflict = true;
      if (duplicateUser.profileQuestion && userData.profileQuestion) {
        const talkedWithCHWUser = getTalkedWithCHW(
          duplicateUser.profileQuestion
        );
        const talkedWithCHWMain = getTalkedWithCHW(userData.profileQuestion);
        if (talkedWithCHWUser !== talkedWithCHWMain)
          isTalkedWithCHWConflict = true;

        const heardAboutUsUser = getHeardAboutUse(
          duplicateUser.profileQuestion
        );
        const heardAboutUsMain = getHeardAboutUse(userData.profileQuestion);
        if (heardAboutUsUser !== heardAboutUsMain)
          isHeardAboutUsConflict = true;
      }

      duplicateUser.isPhoneConflict =
        duplicateUser.Phone &&
        userData.Phone &&
        duplicateUser.Phone !== userData.Phone;
      duplicateUser.isEmailConflict =
        duplicateUser.email &&
        userData.email &&
        duplicateUser.email !== userData.email;
      duplicateUser.isAddressConflict =
        duplicateUser.address &&
        userData.address &&
        duplicateUser.address !== userData.address;
      duplicateUser.isZipCodeConflict =
        duplicateUser.zipCode &&
        userData.zipCode &&
        duplicateUser.zipCode !== userData.zipCode;
      duplicateUser.isAssignToConflict =
        duplicateUser.assign_to?._id.toString() !==
        userData.assign_to?._id?.toString();
      duplicateUser.isStatusConflict =
        duplicateUser.status &&
        userData.status &&
        duplicateUser.status !== userData.status;
      duplicateUser.isTalkedWithCHWConflict = isTalkedWithCHWConflict;
      duplicateUser.isHeardAboutUsConflict = isHeardAboutUsConflict;
    }

    userData.isPhoneConflict = isPhoneConflict;
    userData.isEmailConflict = isEmailConflict;
    userData.isAddressConflict = isAddressConflict;
    userData.isZipCodeConflict = isZipCodeConflict;
    userData.isAssignToConflict = isAssignToConflict;
    userData.isStatusConflict = isStatusConflict;
    userData.isTalkedWithCHWConflict = isTalkedWithCHWConflict;
    userData.isHeardAboutUsConflict = isHeardAboutUsConflict;

    const combinedUsers = [
      {
        mainUser: userData,
        duplicateUsers: duplicateUsers,
      },
    ];

    return res.status(200).json({
      status: true,
      message: "Duplicate users found",
      data: combinedUsers,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const mergeData = async (req, res) => {
  try {
    const { id, mergeData, otherId } = req.body;

    if (mergeData.assignTo) {
      const [firstName, lastName] = mergeData.assignTo?.split(" ");
      const assignToUser = await user
        .findOne({
          firstName,
          lastName,
          role: "CHW",
          isArchive: false,
        })
        .lean();

      mergeData.assign_to = assignToUser?._id;
    }

    const mergedData = await user
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...mergeData,
            mergedWith: otherId,
          },
        },
        { new: true }
      )
      .lean();

    const otherData = await user
      .updateMany(
        { _id: { $in: otherId } },
        { $set: { isArchive: true, mergedWith: id } },
        { new: true }
      )
      .lean();

    const otherVisits = await visit
      .find({ clientId: { $in: otherId }, isArchive: false })
      .lean();
    if (otherVisits.length !== 0) {
      await visit.updateMany(
        { clientId: { $in: otherId }, isArchive: false },
        { $set: { clientId: id, assign_to: mergeData.assign_to } },
        { new: true }
      );
    }

    const otherRequests = await request
      .find({ request_by: { $in: otherId }, isArchive: false })
      .populate("assign_to", "role")
      .lean();
    if (otherRequests.length !== 0) {
      for (const req of otherRequests) {
        let newAssignTo;
        if (req.assign_to.role === "Client") {
          newAssignTo = id;
        } else if (req.assign_to.role === "CHW") {
          newAssignTo = mergeData.assign_to;
        }

        await request.updateOne(
          { _id: req._id },
          { $set: { request_by: id, assign_to: newAssignTo } },
          { new: true }
        );
      }
    }

    const otherTodos = await taskClient
      .find({ clientId: { $in: otherId }, isArchive: false })
      .lean();
    if (otherTodos.length !== 0) {
      await taskClient.updateMany(
        { clientId: { $in: otherId }, isArchive: false },
        { $set: { clientId: id, assign_to: mergeData.assign_to } },
        { new: true }
      );
    }

    return res.status(200).json({
      status: true,
      message: "Data merged successfully",
      mergedData,
      otherData,
    });
  } catch (error) {
    console.log("error :", error);
    return InternalServerError(res, error);
  }
};

const setReassessmentDateScript = async (req, res) => {
  try {
    const users = await user.find({ role: "Client", isArchive: false }).lean();

    const updates = users.map((usersss) => {
      const reassessmentDate = dayjs(usersss.createdAt)
        .add(3, "month")
        .toDate();
      const data = user.findOneAndUpdate(
        { _id: usersss._id },
        { $set: { reassessmentDate: reassessmentDate } },
        { new: true }
      );
      return data;
    });

    await Promise.all(updates);

    return (
      res.status(200).json({
        status: true,
        message: "Reassessment dates updated successfully",
      })
    );
  } catch (error) {
    console.log("error", error);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email, role } = req.body;
    if (typeof email !== "string" || typeof otp !== "string") {
      return res.status(400).json({ message: "Invalid request." });
    }
    const normalizedEmail = email.toLowerCase();

    let user;

    if (role === "Super_Admin") {
      user = await userModel.findOne({ email: normalizedEmail, role: role });
    } else {
      user = await userModel.findOne({
        email: normalizedEmail,
        role: { $ne: "Super_Admin" },
      });
    }

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired temporary token." });
    }

    const currentTime = new Date();
    if (!user.otp_expiry_time || currentTime > user.otp_expiry_time) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    const authToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRETE_KEY, {
      expiresIn: "7d",
    });

    user.otp = null;
    await user.save();

    res.status(200).json({ status: true, message: "OTP verified successfully.", token: authToken });
  } catch (error) {
    console.log("error", error);
  }
}

const resendOTP = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user;

    if (role === "Super_Admin") {
      user = await userModel.findOne({ email: email, role: role });
    } else {
      user = await userModel.findOne({
        email: email,
        role: { $ne: "Super_Admin" },
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = generateOTP(user._id);
    const otpExpiryTime = dayjs().add(10, "minute").toDate();

    await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { otp: otp, otp_expiry_time: otpExpiryTime } },
      { new: true }
    );

    await multiFactorEmail(user, otp);

    res.status(200).json({ status: true, message: "OTP resent successfully." });
  } catch (error) {
    console.log("Error:", error);
    return InternalServerError(res, error);
  }
}

module.exports = {
  createUser,
  listLanaguage,
  listEthinicty,
  listPrononuce,
  createChwAndClient,
  loginUser,
  getAllUser,
  getSingleUser,
  getChwClientList,
  getUserDetails,
  updateUser,
  getAllClients,
  getAllChw,
  deleteUser,
  searchUser,
  searchClient,
  searchChwClient,
  searchChw,
  verifyEmail,
  forgetPwd,
  deleteMultiUser,
  resetPassword,
  getUserByActive,
  getUserByTime,
  newSignUp,
  profileHistory,
  mapProfileQuestions,
  verifyAccessTimeLimit,
  verifyForgetLink,
  setPassword,
  ChangePassword,
  listAndSerchCHW,
  listAndSerchUser,
  listAndSerchZipCode,
  listAndSerchResourceGiven,
  listAssignedClient,
  chwAssign,
  createClient,
  listDuplicateUser,
  mergeData,
  setReassessmentDateScript,
  verifyOTP,
  resendOTP
};
