import https from 'https';
import fs from 'fs';

const url = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/One_Ring_inscription.svg';
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, options, (res2) => {
      res2.pipe(fs.createWriteStream('public/assets/inscription.svg'));
    });
  } else {
    res.pipe(fs.createWriteStream('public/assets/inscription.svg'));
  }
}).on('error', (err) => {
  console.error(err);
});
