import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async url => {
  try {
    const fetchPromise = fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const resObj = await res.json();
    if (!res.ok) throw new Error(`${resObj.message} (${res.status})`);
    return resObj;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async (url, uploadData) => {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const resObj = await res.json();
    if (!res.ok) throw new Error(`${resObj.message} (${res.status})`);
    return resObj;
  } catch (err) {
    throw err;
  }
};
