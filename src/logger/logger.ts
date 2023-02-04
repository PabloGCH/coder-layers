import log4js from "log4js";


log4js.configure({
    appenders: {
        console: {type: "console"},
        warnLogFile: {type: "file", filename: "logs/warn.log"},
        errorLogFile: {type: "file", filename: "logs/error.log"}
    },
    categories: {
        default: { appenders: ["console"], level: "trace"},
        errors: { appenders: ["console", "errorLogFile"], level: "error"},
        warnings: { appenders: ["console" , "warnLogFile"], level: "warn"}
    }
})

export const logger = log4js.getLogger("default");
export const warningLogger = log4js.getLogger("warnings");
export const errorLogger = log4js.getLogger("errors");
