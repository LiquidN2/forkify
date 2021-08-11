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
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // const res = await fetch(url);
    const resObj = await res.json();

    if (!res.ok) throw new Error(`${resObj.message} (${res.status})`);
    return resObj;
  } catch (err) {
    throw err;
  }
};
