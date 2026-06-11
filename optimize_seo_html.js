const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. 全局图片懒加载 (Lazy Loading)
    // 寻找没有 loading="lazy" 属性的 img 标签
    const imgRegex = /<img(?![^>]*loading=["']lazy["'])([^>]*)>/gi;
    if (imgRegex.test(content)) {
        content = content.replace(imgRegex, '<img$1 loading="lazy">');
        changed = true;
    }

    // 2. 外部链接权重流失保护卫士 (Nofollow策略)
    // 寻找 <a> 标签
    const aRegex = /<a([^>]*)href=["']([^"']*)["']([^>]*)>/gi;
    
    content = content.replace(aRegex, (match, beforeHref, href, afterHref) => {
        // 如果不是 http 开头，或者包含当前域名，则是内部链接，跳过
        if (!href.startsWith('http') || href.includes('fanfanqiang.net')) {
            return match;
        }

        let isModified = false;
        let newBefore = beforeHref;
        let newAfter = afterHref;
        
        // 检查 target
        if (!/target=["']_blank["']/i.test(match)) {
            newAfter += ' target="_blank"';
            isModified = true;
        }

        // 检查 rel
        if (!/rel=["'][^"']*nofollow[^"']*["']/i.test(match)) {
            // 如果已经有 rel，追加 nofollow noopener
            if (/rel=["']([^"']*)["']/i.test(match)) {
                newBefore = newBefore.replace(/rel=["']([^"']*)["']/i, (m, p1) => {
                    let rels = p1.split(' ').map(s=>s.trim()).filter(Boolean);
                    if (!rels.includes('nofollow')) rels.push('nofollow');
                    if (!rels.includes('noopener')) rels.push('noopener');
                    return `rel="${rels.join(' ')}"`;
                });
                newAfter = newAfter.replace(/rel=["']([^"']*)["']/i, (m, p1) => {
                    let rels = p1.split(' ').map(s=>s.trim()).filter(Boolean);
                    if (!rels.includes('nofollow')) rels.push('nofollow');
                    if (!rels.includes('noopener')) rels.push('noopener');
                    return `rel="${rels.join(' ')}"`;
                });
                isModified = true;
            } else {
                newAfter += ' rel="nofollow noopener"';
                isModified = true;
            }
        }

        if (isModified) {
            changed = true;
            return `<a${newBefore}href="${href}"${newAfter}>`;
        }

        return match;
    });

    if (changed) {
        fs.writeFileSync(file, content);
        modifiedCount++;
    }
}

console.log(`Successfully optimized ${modifiedCount} HTML files (Lazy Loading & External Nofollow).`);
