const https = require('https');

https.get('https://fanqiangnan.com/data_sync.php', (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log("Response:", body.substring(0, 500));
        fs.writeFileSync('data_sync_response.json', body);
    });
}).on('error', (e) => {
    console.error(e);
});
const fs = require('fs');
