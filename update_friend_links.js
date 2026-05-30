const fs = require('fs');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldLink1 = '<a href="https://vpnsgocn.com/" target="_blank">VPN风暴云</a>';
const newLink1 = '<a href="https://vpnsgocn.com/" target="_blank" rel="dofollow">VPN风暴云</a>';

const oldLink2 = '<a href="https://clashvpns.cloud/" target="_blank">柳如烟</a>';
const newLink2 = '<a href="https://clashvpns.cloud/" target="_blank" rel="dofollow">柳如烟</a>';

let count = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes(oldLink1)) {
        content = content.replace(new RegExp(oldLink1.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newLink1);
        modified = true;
    }
    if (content.includes(oldLink2)) {
        content = content.replace(new RegExp(oldLink2.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newLink2);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        count++;
    }
}

console.log('Updated friend links in ' + count + ' files.');
