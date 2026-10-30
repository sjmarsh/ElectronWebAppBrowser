import simpleLogger from './simpleLogger';
import { expect, test, vi } from 'vitest';
import fs from 'fs';

vi.mock('fs');

const logFileName = 'app.log';

test('it should log message to console', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theMessage = 'Message to log';
    const regex = new RegExp(`${logDate}.*${theMessage}`);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    simpleLogger.log(theMessage);

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(regex));

    logSpy.mockRestore();
});

test('it should log message to file', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theMessage = 'Message to log';
    const regex = new RegExp(`${logDate}.*${theMessage}`);

    simpleLogger.log(theMessage);

    expect(fs.appendFile).toHaveBeenCalledWith(
        expect.stringContaining(logFileName),
        expect.stringMatching(regex),
        expect.any(Function)
    );
});

test('it should log message with detail', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theMessage = 'Message to log';
    const theDetail = { result: 'It was a success', value: 5 };
    const regex = new RegExp(`${logDate}.*${theMessage}.*${JSON.stringify(theDetail)}`);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    simpleLogger.logDetail(theMessage, theDetail);

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(regex));

    logSpy.mockRestore();
});

test('it should log error', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theError = 'Oh No!';
    const regex = new RegExp(`${logDate}.*${' ERROR: '}.*${theError}`);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    simpleLogger.error(theError);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(regex));

    errorSpy.mockRestore();
});


test('it should log error with detail', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theError = 'Oh No!';
    const theDetail = { result: 'It failed', value: 7 };
    const regex = new RegExp(`${logDate}.*${' ERROR: '}.*${theError}.*${JSON.stringify(theDetail)}`);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    simpleLogger.errorDetail(theError, theDetail);

    expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(regex));

    errorSpy.mockRestore();
});
