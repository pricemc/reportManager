var fs = require('fs');
var path = require('path');
var winston = require('winston'),
    expressWinston = require('express-winston');
var logDir = 'log'; // directory path you want to set
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDir);
}
const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, 'api.log') }),
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        })
    ]
});

logger.expressLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(logDir, 'accessLog.log') })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
});

module.exports = logger