const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldContent = '<p class="gt-link">GT: <a href="https://t.me/LRYYSH" target="_blank">@LRYYSH</a></p>';
const newContent = '<a href="https://t.me/LRYYSH" target="_blank" class="gt-link-btn">GT: @LRYYSH</a>';

let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    if (content.includes(oldContent)) {
        content = content.replace(new RegExp(oldContent.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), newContent);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
}

// Append CSS to style.css
const cssToAppend = `
.gt-link-btn {
    display: inline-block;
    background-color: #A9CDE4;
    color: #ffffff;
    font-weight: 800;
    padding: 6px 20px;
    border-radius: 20px;
    text-decoration: none;
    margin-top: 5px;
    transition: background 0.3s;
}
.gt-link-btn:hover {
    background-color: #8bb7d3;
    color: #ffffff;
}
`;

fs.appendFileSync('style.css', cssToAppend);

console.log(`Finished updating HTML files and added CSS.`);
