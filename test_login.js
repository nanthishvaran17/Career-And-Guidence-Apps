const http = require('http');

const data = JSON.stringify({
    email: 'nanthishvaran17@gmail.com',
    password: '123456789' // This is the password I likely set in check_user_and_companies.js
});
// Step 820 output: "Password: 123456789". So password is "123456789".

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/users/login-init',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    console.log(`StatusCode: ${res.statusCode}`);
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
