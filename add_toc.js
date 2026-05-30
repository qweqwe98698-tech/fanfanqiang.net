const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.startsWith('article-') && f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Check if toc already exists
    if (content.includes('<div class="toc">')) {
        console.log(`TOC already exists in ${file}`);
        return;
    }

    // Isolate the article body
    const bodyStartIdx = content.indexOf('<div class="article-body">');
    if (bodyStartIdx === -1) return;
    
    // Search until FAQ or footer
    let bodyEndIdx = content.indexOf('<section id="faq"', bodyStartIdx);
    if (bodyEndIdx === -1) bodyEndIdx = content.indexOf('<footer', bodyStartIdx);
    if (bodyEndIdx === -1) bodyEndIdx = content.length;
    
    let preBody = content.slice(0, bodyStartIdx);
    let articleBody = content.slice(bodyStartIdx, bodyEndIdx);
    let postBody = content.slice(bodyEndIdx);

    // Build TOC HTML and replace headings
    let tocHtml = '<div class="toc">\n    <div class="toc-title">📖 文章目录</div>\n    <ul>\n';
    let counter = 1;
    let headingCount = 0;

    articleBody = articleBody.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/g, (match, tag, attrs, innerText) => {
        headingCount++;
        // Strip tags from innerText for the TOC label
        let label = innerText.replace(/<[^>]+>/g, '').trim();
        let id = `heading-${counter++}`;
        
        let newAttrs = attrs;
        if (!newAttrs.includes('id=')) {
            newAttrs += ` id="${id}"`;
        } else {
            const idMatch = newAttrs.match(/id="([^"]+)"/);
            if (idMatch) id = idMatch[1];
        }

        let liClass = tag === 'h3' ? ' class="toc-sub"' : '';
        tocHtml += `        <li${liClass}><a href="#${id}">${label}</a></li>\n`;

        return `<${tag}${newAttrs}>${innerText}</${tag}>`;
    });

    tocHtml += '    </ul>\n</div>\n';

    if (headingCount > 0) {
        // Insert TOC right after lead text, or at the top of article-body
        const leadTextMatch = articleBody.match(/<p class="lead-text">[\s\S]*?<\/p>\s*/);
        if (leadTextMatch) {
            articleBody = articleBody.replace(leadTextMatch[0], leadTextMatch[0] + '\n' + tocHtml + '\n');
        } else {
            // insert right after <div class="article-body">
            articleBody = articleBody.replace('<div class="article-body">', '<div class="article-body">\n' + tocHtml + '\n');
        }

        fs.writeFileSync(file, preBody + articleBody + postBody);
        console.log(`Added TOC to ${file}`);
    } else {
        console.log(`No headings found in ${file}`);
    }
});

// Update style.css
const cssPath = 'style.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.toc {')) {
    const tocCss = `
/* Table of Contents */
.toc {
    background: #f8fcf8;
    border: 1px solid var(--light-green);
    border-radius: 12px;
    padding: 20px 25px;
    margin: 30px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.toc-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
    display: inline-block;
    padding-bottom: 5px;
}
.toc ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.toc li {
    margin-bottom: 10px;
}
.toc li a {
    color: #444;
    text-decoration: none;
    transition: color 0.2s ease;
    display: block;
    line-height: 1.5;
}
.toc li a:hover {
    color: var(--primary-color);
    text-decoration: underline;
}
.toc li.toc-sub {
    padding-left: 20px;
    font-size: 0.95em;
    position: relative;
}
.toc li.toc-sub::before {
    content: "└";
    position: absolute;
    left: 4px;
    color: #999;
}
`;
    fs.appendFileSync(cssPath, tocCss);
    console.log('Added TOC styles to style.css');
}
