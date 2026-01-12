const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/uploads/resume-1768233175964.pdf',
  method: 'HEAD'
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
