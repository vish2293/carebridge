const { user, profileQuestion, profileQuestionHistory } = require("../../models")
const { InternalServerError, NotAccessError } = require("../../utils/errorHandling")

const requiredFields = ['firstName', 'lastName', 'email', 'Phone', 'zipCode'];

const fieldMap = {
    'First Name': 'firstName',
    firstname: 'firstName',
    fname: 'firstName',
    name: 'firstName',
    'first name': 'firstName',
    'Last Name': 'lastName',
    lastname: 'lastName',
    lname: 'lastName',
    'user name': 'userName',
    'userName': 'userName',
    'User Name': 'userName',
    'last name': 'lastName',
    "Phone Number": 'Phone',
    'Contact No': 'Phone',
    'contact no': 'Phone',
    contactno: 'Phone',
    'Email ID': 'email',
    'email address': 'email',
    'Email Address': 'email',
    "Date of Birth": "birthDate",
    "Birth Date": "birthDate",
    "birthdate": "birthDate",
    birthdate: "birthdate",
    email: 'email',
    'Zip Code': 'zipCode',
    zipCode: 'zipCode'
}

const importCsv = async (req, res) => {
    try {
        const role = req.role;
        const dataArray = req.body.data;

        if (role === "Program_Administrator" || role === "Super_Admin") {
            if (!Array.isArray(dataArray)) {
                return res.status(400).json({ message: "Data array is not an array" });
            }

            const insertedData = [];
            const existingUsers = await user.find({ isArchive: false, role: "Client" }, 'firstName lastName birthDate').sort({ createdAt: -1 });
            const successData = [];
            const errorData = [];
            let successfullyImportedCount = 0;
            let duplicateEmailCount = 0;
            let hasError = false;
            let storeInHistory;

            for (const dataItem of dataArray) {
                for (const row of dataItem.successData) {
                    const rowData = {};

                    for (const [columnName, value] of Object.entries(row)) {
                        const mappedField = fieldMap[columnName] || columnName;

                        // if (requiredFields.includes(mappedField)) {
                        //     if (typeof value !== 'string' || value.trim() === '') {
                        //         hasError = true;
                        //         rowData['errorMessage'] = `Row with ${columnName} is a required field and is blank.`;
                        //     }
                        // }

                        if (mappedField === "CHW" || mappedField === "chw") {
                            const chwName = value;
                            const spaceIndex = chwName.indexOf(' ');
                            const chwFirstName = spaceIndex !== -1 ? chwName.substring(0, spaceIndex) : chwName;
                            const chwLastName = spaceIndex !== -1 ? chwName.substring(spaceIndex + 1) : '';

                            const findChwUsingFLName = await user.findOne({ firstName: chwFirstName, lastName: chwLastName })

                            if (!findChwUsingFLName) {
                                const addChw = new user({
                                    firstName: chwFirstName,
                                    lastName: chwLastName,
                                    role: 'CHW'
                                })

                                await addChw.save()

                                rowData.assign_to = addChw._id
                                rowData.isChw_Assign = true;
                            } else {
                                rowData.assign_to = findChwUsingFLName._id
                                rowData.isChw_Assign = true;
                            }
                        }

                        if (mappedField.split(' ').length >= 3) {
                            const matchingQuestion = await profileQuestion.findOne({ 'questionML.value': mappedField });
                            if (matchingQuestion) {
                                rowData.profileQuestion = rowData.profileQuestion || [];

                                // const values = value.split(' / ')
                                rowData.profileQuestion.push({
                                    question: matchingQuestion._id,
                                    answer: [
                                        {
                                            key: 'en',
                                            answer: value[0]
                                        },
                                        {
                                            key: 'es',
                                            answer: value[1]
                                        }
                                    ]
                                });

                                let objectiveLabel;
                                let objectiveValue;
                                switch (mappedField) {
                                    case "What is your housing situation today?":
                                        objectiveLabel = "housingSecurity";
                                        objectiveValue = (value[0] === "I do not have housing" || value[0] === "I have housing today, but I am worried about losing housing")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "How often do you worry that your food might run out before you have money to buy more?":
                                        objectiveLabel = "foodSecurity";
                                        objectiveValue = (value[0] === "Often" || value[0] === "Sometimes")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "How often do you worry about having enough money to pay your bills?":
                                        objectiveLabel = "economicSecurity";
                                        objectiveValue = (value[0] === "Often" || value[0] === "Sometimes")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "How often has lack of transportation kept you from medical appointments, meetings, work or from getting things needed for daily living?":
                                        objectiveLabel = "transportationSecurity";
                                        objectiveValue = (value[0] === "Often" || value[0] === "Sometimes")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "Do problems getting child care make it difficult for you to work?":
                                        objectiveLabel = "childcareSecurity";
                                        objectiveValue = (value[0] === "Often" || value[0] === "Sometimes")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "Do you have a job?":
                                        objectiveLabel = "employmentSecurity";
                                        objectiveValue = (value[0] === "No, I am unable to work" || value[0] === "No, but I want to be employed" || value[0] === "Yes, but my job is not steady")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "Do you have a high school education or GED?":
                                        objectiveLabel = "educationSecurity";
                                        objectiveValue = (value[0] === "Yes")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                    case "Do you have a regular doctor or clinic that you are able to use?":
                                        objectiveLabel = "healthcareSecurity";
                                        objectiveValue = (value[0] === "No, but I need one" || value[0] === "No")
                                            ? "Unstable"
                                            : "Stable";
                                        break;
                                }

                                if (objectiveLabel && objectiveValue) {
                                    rowData.objective = rowData.objective || [];
                                    rowData.objective.push({
                                        label: objectiveLabel,
                                        value: objectiveValue
                                    });
                                }
                            }
                        }

                        if (mappedField === 'gender') {
                            rowData[mappedField] = convertGenderToUpperCase(value);
                        } else {
                            rowData[mappedField] = value;
                        }
                    }

                    const birthDate = rowData['birthDate'];
                    const firstName = rowData['firstName'];
                    const lastName = rowData['lastName'];

                    if (Array.isArray(birthDate)) {
                        rowData['birthDate'] = birthDate.find(date => date);
                    } else {
                        rowData['birthDate'] = birthDate;
                    }

                    const isDuplicate = existingUsers.some(user =>
                        user.firstName === firstName &&
                        user.lastName === lastName &&
                        user.birthDate === rowData['birthDate']
                    );

                    if (rowData['birthDate']) {
                        if (isDuplicate) {
                            hasError = true;
                            rowData['errorMessage'] = `Entry with '${rowData['birthDate']}' already exists in the database.`;
                            duplicateEmailCount++;
                        } else {
                            rowData.role = 'Client';
                            rowData.createdBy = req.userId;
                            rowData.profileQuestionBy = req.userId;
                            rowData.isCsvUpload = true;
                            insertedData.push(rowData);
                            successData.push(rowData);
                            successfullyImportedCount++;
                        }
                    } else {
                        hasError = true;
                        rowData['errorMessage'] = `Required fields are missing.`;
                    }
                }
            }

            const insertedPatients = await user.insertMany(insertedData);

            for (const patient of insertedPatients) {
                const storeInHistory = new profileQuestionHistory({
                    profileQuestion: patient.profileQuestion,
                    clientId: patient._id,
                    submittedBy: req.userId
                });
                await storeInHistory.save();
            }

            await user.populate(insertedPatients, { path: 'assign_to' });

            const errorDataLength = errorData.length;
            const insertedUsersLength = insertedPatients.length;

            return res.status(201).json({
                status: true,
                data: {
                    successfullyImportedCount,
                    duplicateEmailCount,
                    missingFieldsCount: dataArray[0].errorData?.length,
                    missingFieldsDetails: dataArray[0].errorData,
                    inserted: insertedPatients,
                    // errorData,
                    // errorDataLength,
                    insertedUsersLength,
                }
            })
        } else {
            return NotAccessError(res, "You don't have access to import CSV");
        }
    } catch (error) {
        console.error(error);
        return InternalServerError(res, error);
    }
};

const getCsvData = async (req, res) => {
    const role = req.role;

    if (role === "Program_Administrator" || role === "Super_Admin") {
        const filter = {
            isCsvUpload: true,
            isArchive: false
        };

        const csvData = await user.find(filter).populate('assign_to').sort({ createdAt: -1 })

        return res.status(201).json({ csvData });
    }
}

module.exports = { importCsv, getCsvData }