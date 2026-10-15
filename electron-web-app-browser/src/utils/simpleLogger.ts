import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'app.log');

function log(message: string) { 
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry.trim());
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function logDetail(message: string, obj: any) {
    const completeMessage = obj ? `${message} ${JSON.stringify(obj)}` : message;
    log(completeMessage);
}

function error(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logEntry.trim());
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorDetail(message: string, err: any) {
    const completeMessage = err ? `${message} ${JSON.stringify(err)}` : message;
    error(completeMessage);
}

export default {
    log,
    logDetail,
    error,
    errorDetail
}