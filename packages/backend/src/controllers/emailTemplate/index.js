const { user, emailTemplate, contactUs } = require('../../models');
const { contactUsMailTemp } = require('../../services/emailServices/contactUs');

const saveTemplate = async (req, res) => {
  const { name, subjectTemplate, bodyTemplate } = req.body;
  try {
    const userId = req.userId
    const userData = await user.findOne({ _id: userId })
    const role = userData?.role

    if (role === "Program_Administrator") {
      const template = new emailTemplate({
        name,
        subjectTemplate,
        bodyTemplate,
      });
      const templateDataSave = await template.save()
      return res.status(201).json(templateDataSave);
    } else {
     return res.status(403).json({ message: "A user has not access to create template" })
    }
  } catch (error) {
    console.error('Error saving template:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTemplate = async (name, req, res) => {
  try {
    const template = await emailTemplate.findOne({ name });

    if (!template) {
      return res?.status(404).json({ error: 'Template not found' });
    }

    return template
  } catch (error) {
    console.error('Error getting template:', error);
    return res?.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const userId = req.userId
    const userData = await user.findOne({ _id: userId })
    const role = userData?.role

    const id = req.params?.id

    if (role === "Program_Administrator") {
      const updateTemplates = await emailTemplate.updateOne({ _id: id }, { $set: req?.body })
    return  res.status(201).json(updateTemplates);
    } else {
    return  res.status(403).json({ message: "A user has not access to create template" })
    }
  } catch (error) {
    console.error('Error saving template:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


//FORGET PWD
const contactUsMail = async (req, res) => {
  try {
    const findUser = await user.findOne({role:"Program_Administrator"});
    if (findUser === null) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    } else {
      const contactUSData = new contactUs(req.body);
      await contactUSData.save()
      contactUsMailTemp(findUser, req.body);
      return res.status(200).json({
        status: true,
        message: "User mail sent successfully!",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  saveTemplate,
  getTemplate,
  updateTemplate,
  contactUsMail
};