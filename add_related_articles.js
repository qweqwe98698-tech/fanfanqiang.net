const fs = require('fs');
const path = require('path');

const dir = __dirname;
const indexHtmlPath = path.join(dir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Parse index.html to extract all article links and titles
const articleRegex = /<a href="(article-[^"]+\.html)" class="article-card">[\s\S]*?<h4>(.*?)<\/h4>/g;
let match;
const articles = [];

while ((match = articleRegex.exec(indexHtml)) !== null) {
    articles.push({
        href: match[1],
        title: match[2].trim()
    });
}

console.log(`Found ${articles.length} articles in index.html`);

const files = fs.readdirSync(dir);
let updatedCount = 0;

for (const file of files) {
    if (file.startsWith('article-') && file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Skip if already added
        if (content.includes('class="related-articles"')) {
            // console.log(`Already has related articles: ${file}`);
            continue;
        }

        // Find 3 other articles to link
        const otherArticles = articles.filter(a => a.href !== file);
        if (otherArticles.length === 0) continue;

        // Pick 3 random articles
        const selected = [];
        for (let i = 0; i < Math.min(3, otherArticles.length); i++) {
            const randomIndex = Math.floor(Math.random() * otherArticles.length);
            selected.push(otherArticles[randomIndex]);
            otherArticles.splice(randomIndex, 1);
        }

        let relatedHtml = `\n    <div class="related-articles" style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee;">\n        <h3>📌 推荐阅读</h3>\n        <ul style="list-style: none; padding: 0; line-height: 1.8;">\n`;
        
        for (const item of selected) {
            relatedHtml += `            <li style="margin-bottom: 10px;">👉 <a href="${item.href}" style="color: #2980b9; text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${item.title}</a></li>\n`;
        }
        relatedHtml += `        </ul>\n    </div>\n`;

        // Inject right before the closing </div> of .article-body
        // The last closing div of article body is usually followed by \s*</div>\s*</section> or similar
        const articleBodyEndRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/section>/;
        
        // Let's do a safer injection: find the last </div> before the end of .article-body
        // A simple way is to replace the last </div> before the closing tag of .article-body, but since article-body closing is hard to pinpoint, let's just use string replacement on the exact structure.
        
        const injectionTarget = /<\/div>\s*(?:<\/div>\s*)*<\/section>/;
        // Actually, looking at the template, the article-body ends with:
        // </div>\n        </div>\n    </section> (if there are nested divs)
        // Let's just find the closing </div> of article-body.
        
        // In most files, the article ends with something like:
        // <p>一句话总结：...</p>\n</div>
        
        const lastDivRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/section>/;
        const replaceMatch = content.match(/<\/div>\s*(?:<\/div>\s*)*<\/section>/);
        
        if (replaceMatch) {
            // Instead of replacing the section end, let's insert before the first </div> that closes article-body.
            // Since .article-body contains everything, replacing the first </div> from the bottom that belongs to it might be tricky.
            // Let's replace the last </div> that is inside <div class="container"...>
            
            // Let's find the string: </div>\n\n        </div>\n    </section>
            // or </div>\n        </div>\n    </section>
            
            content = content.replace(/(<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, (m) => {
                // If it matches </div></div></section>, the first </div> is the article-body closing.
                if (m.startsWith('</div>\n\n        </div>') || m.startsWith('</div>\n        </div>')) {
                    return relatedHtml + m;
                }
                return relatedHtml + m;
            });
            
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            updatedCount++;
        }
    }
}

console.log(`Successfully added related articles to ${updatedCount} files.`);
