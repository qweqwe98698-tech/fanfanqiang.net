const https = require('https');
const fs = require('fs');

https.get('https://fanqiangnan.com/data_sync.php', (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(body);
            let usAccounts = [];
            
            // Search all groups
            if (json.data && json.data.accounts) {
                for (const groupKey in json.data.accounts) {
                    const group = json.data.accounts[groupKey];
                    if (Array.isArray(group)) {
                        for (const acc of group) {
                            if (acc.region === 'US' || acc.regionName.includes('美国') || acc.fullEmail) {
                                usAccounts.push(acc);
                            }
                        }
                    }
                }
            }
            
            // Filter only valid ones and take 6
            usAccounts = usAccounts.filter(a => a.status.includes('正常') || a.status.includes('可用'));
            const top6 = usAccounts.slice(0, 6);
            
            if (top6.length === 0) {
                console.log("No valid accounts found.");
                return;
            }
            
            console.log("Updating with accounts:", top6);
            
            // Read apple-id-shared.html
            let html = fs.readFileSync('apple-id-shared.html', 'utf8');
            
            // Replace acc1..acc6 and pwd1..pwd6
            for (let i = 0; i < top6.length; i++) {
                const acc = top6[i];
                const accId = `id="acc${i+1}"`;
                const pwdId = `id="pwd${i+1}"`;
                
                // Replace in HTML
                const accRegex = new RegExp(`<div class="account-value" ${accId}>[^<]+</div>`);
                const pwdRegex = new RegExp(`<div class="account-value" ${pwdId}>[^<]+</div>`);
                
                html = html.replace(accRegex, `<div class="account-value" ${accId}>${acc.fullEmail}</div>`);
                html = html.replace(pwdRegex, `<div class="account-value" ${pwdId}>${acc.password}</div>`);
            }
            
            fs.writeFileSync('apple-id-shared.html', html);
            console.log("Successfully updated apple-id-shared.html with 6 new accounts.");
            
        } catch (e) {
            console.error("Failed to parse API or update file:", e);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});
