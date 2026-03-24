import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic';
import isUp from './isUp';
import simpleLogger from "./simpleLogger";

const waitForUrl = async (url: string, retryIntervalMs: number,  maxAttempts: number) : Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      simpleLogger.log(`Waiting for URL ${url} to be ready.`)
      let attempts = 0;
      const appUrlTimer = setIntervalAsync(async () => {
        simpleLogger.log(`Testing if URL ${url} is ready. Attempt: ${attempts} of ${maxAttempts}`)
        let isUrlUp = await isUp(url);
        if(isUrlUp) {
          simpleLogger.log('URL is ready. Stop waiting.');
          resolve(true);
          await clearIntervalAsync(appUrlTimer);
        }
        if(attempts >= maxAttempts){
          reject('Maxiumum attempts to reach URL reached');
          await clearIntervalAsync(appUrlTimer);
          
        }
        attempts++;
      }, retryIntervalMs);
    } catch(error) {
      reject(`Unexpected error occurred waiting for URL ${url}: Error: ${error}`);
    }    
  });
}

export default waitForUrl;