const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const auditLogModel = require("../models/auditLogs");

const auditMiddleware = async (req, res, next) => {
    try {
        if (req.body.clientId || req.body.userId || req.body.id || req.body.request_by || req.params.id || req.params.clientId || req.query.id) {
            let userId = "Unknown User";
            let role;
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
                userId = decoded.userId;
                role = decoded.role;
            }

            const logData = {
                route: req.ip,
                method: req.method,
                accessedBy: userId,
                accessedRole: role,
                accessedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                accessedData:
                    req.body.clientId || req.body.userId || req.body.id || req.body.request_by || req.params.id || req.params.clientId || req.query.id || "N/A",
            };

            await auditLogModel.create(logData);
        }
        next();
    } catch (error) {
        console.error("Error in audit logging middleware:", error);
        next();
    }
};

module.exports = auditMiddleware;
