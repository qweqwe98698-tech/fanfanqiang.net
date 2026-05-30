const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldContent1 = '<h4>友情链接</h4>';
const newContent1 = '<h4>关于我们</h4>';

const oldContent2 = 'Telegram: <a href="https://t.me/LRYYSH"';
const newContent2 = 'GT: <a href="https://t.me/LRYYSH"';

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
