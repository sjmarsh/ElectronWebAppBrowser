import simpleLogger from "./simpleLogger";

test('it should log message to console', () => {
    const logDate =  new Date().toISOString().split('T')[0];  // ignore the time. just use date for simplicity
    const theMessage = 'Message to log';
    const regex = new RegExp(`${logDate}.*${theMessage}`);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    simpleLogger.log(theMessage);

    //expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(logDate));
    //expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(theMessage));
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(regex));

    logSpy.mockRestore();
});

