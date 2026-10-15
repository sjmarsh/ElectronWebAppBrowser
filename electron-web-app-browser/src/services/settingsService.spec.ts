import settingsService from "./settingsService";
import simpleLogger from "../utils/simpleLogger";
import fs from 'fs';

jest.mock('fs');

beforeEach(() => {
    settingsService.clearSettings();
})

test('it should read settings from settings file', async () => {
    const basePath = '\\mock\\path';
    const settingsJsonString = '{"AppDisplayName": "The App", "AppPath": "The Install Path", "ExecutableName": "TheApp.exe",  "AppUrl": "http://localhost:5000", "HideConsoleWindow": true,  "AppIcon": "The Icon Path" }';
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(basePath);
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(settingsJsonString);
    const loggerSpy = jest.spyOn(simpleLogger, 'log').mockImplementation(() => {});
    
    const result = await settingsService.readSettings();
    
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Reading settings from file'));  // nothing cached so read from file    
    expect(fs.existsSync(`${basePath}\\settings.json`)).toBe(true);
    expect(result?.AppDisplayName).toBe("The App");
    expect(result?.AppPath).toBe("The Install Path");
    expect(result?.ExecutableName).toBe("TheApp.exe");
    expect(result?.AppUrl).toBe("http://localhost:5000");
    expect(result?.HideConsoleWindow).toBe(true);
    expect(result?.AppIcon).toBe("The Icon Path");

    cwdSpy.mockRestore();
    existsSpy.mockRestore();
    readSpy.mockRestore();
    loggerSpy.mockRestore();
});

test('it should use cached settings when called a second time', async () => {
    const basePath = '\\mock\\path';
    const settingsJsonString = '{"AppDisplayName": "The App", "AppPath": "The Install Path", "ExecutableName": "TheApp.exe",  "AppUrl": "http://localhost:5000", "HideConsoleWindow": true,  "AppIcon": "The Icon Path" }';
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(basePath);
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readSpy = jest.spyOn(fs, 'readFileSync').mockReturnValue(settingsJsonString);
    const loggerSpy = jest.spyOn(simpleLogger, 'log').mockImplementation(() => {});
    
    //first time
    await settingsService.readSettings();    
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Reading settings from file'));  // nothing cached so read from file    
    
    // second time
    const result = await settingsService.readSettings();
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Using cached settings'));  // should be cached from the first read
    expect(result).not.toBeNull();

    cwdSpy.mockRestore();
    existsSpy.mockRestore();
    readSpy.mockRestore();
    loggerSpy.mockRestore();
});

test('it should log error when cannot find settings file', async () => {
    const basePath = '\\mock\\path';
    const fullPath = `${basePath}\\settings.json`;
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(basePath);
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);  //file doesn't exist
    const loggerSpy = jest.spyOn(simpleLogger, 'error').mockImplementation(() => {});
        
    const result = await settingsService.readSettings();
    
    expect(result).toBeNull();
    expect(loggerSpy).toHaveBeenCalledWith(`Settings file not found at: ${fullPath}`);
    expect(fs.existsSync(fullPath)).toBe(false);
    
    cwdSpy.mockRestore();
    existsSpy.mockRestore();
    loggerSpy.mockRestore();
});


test('it should log error when cannot read settings file', async () => {
    const basePath = '\\mock\\path';
    const fullPath = `${basePath}\\settings.json`;
    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(basePath);
    const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);  
    const readSpy = jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => { throw new Error('Cannot read the file') });
    const loggerSpy = jest.spyOn(simpleLogger, 'errorDetail').mockImplementation(() => {});
    
    const result = await settingsService.readSettings();
    
    expect(result).toBeNull();
    expect(loggerSpy).toHaveBeenCalledWith('Unable to read settings file.', expect.objectContaining({ message: 'Cannot read the file'}));
    expect(fs.existsSync(fullPath)).toBe(true);
    
    cwdSpy.mockRestore();
    existsSpy.mockRestore();
    readSpy.mockRestore();
    loggerSpy.mockRestore();
});
