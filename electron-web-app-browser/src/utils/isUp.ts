import http from 'http';
import logger from './simpleLogger'

const isUp = (url: string) : Promise<boolean> => {
  return new Promise((resolve) => {
    const request = http.request(url, { method: 'HEAD' }, (response) => {
      const statusCode = response.statusCode;
      // Consider 2xx, 3xx codes as reachable (server is responding)
      if (statusCode && statusCode >= 200 && statusCode < 400) {
        logger.log(`Service at ${url} is up (status code: ${statusCode})`);
        resolve(true);
      } else {
        resolve(false);
      }
      request.destroy(); // End the request early
    });

    request.on('error', () => {
      // An error, such as DNS failure, connection timeout, etc.
      resolve(false);
    });

    request.setTimeout(5000, () => { // Set a reasonable timeout (e.g., 5 seconds)
        request.destroy();
        resolve(false);
    });
    
    request.end();
  });
}

export default isUp;