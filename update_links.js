const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldContent1 = '<li><a href="https://vpnsgocn.com/" target="_blank">VPNSGOCN</a></li>';
const newContent1 = '<li><a href="https://vpnsgocn.com/" target="_blank">VPN风暴云</a></li>';

const oldContent2 = '<li><a href="https://clashvpns.cloud/" target="_blank">ClashVPNs</a></li>';
const newContent2 = '<li><a href="https://clashvpns.cloud/" target="_blank">柳如烟</a></li>';

let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes(oldContent1)) {
        content = content.replace(new RegExp(oldContent1.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newContent1);
        modified = true;
    }
    
    if (content.includes(oldContent2)) {
        content = content.replace(new RegExp(oldContent2.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newContent2);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
}

console.log(`Finished updating ${modifiedCount} files.`);
