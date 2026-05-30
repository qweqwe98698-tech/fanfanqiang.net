const fs = require('fs');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Pattern 1: standard formatting
    const pattern1 = '<a href="index.html#about">关于本站</a>\\r?\\n\\s*<a href="https://t.me/LRYYSH" target="_blank" class="nav-gt">GT: @LRYYSH</a>';
    const regex1 = new RegExp(pattern1, 'g');
    
    if (regex1.test(content)) {
        content = content.replace(regex1, '<a href="index.html#about">关于我们</a>');
        modified = true;
    } else {
        // Fallback: replace individually
        if (content.includes('<a href="https://t.me/LRYYSH" target="_blank" class="nav-gt">GT: @LRYYSH</a>')) {
            content = content.replace(/\\s*<a href="https:\/\/t.me\/LRYYSH" target="_blank" class="nav-gt">GT: @LRYYSH<\/a>/g, '');
            modified = true;
        }
        if (content.includes('关于本站')) {
            content = content.replace(/>关于本站</g, '>关于我们<');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, content);
        modifiedCount++;
        console.log(`Updated ${file}`);
    }
}

console.log(`Finished updating ${modifiedCount} files.`);
