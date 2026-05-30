const fs = require('fs');

const rawData = fs.readFileSync('list.txt', 'utf-8');
const lines = rawData.split('\n');

let newCardsHtml = '';
let counter = 12;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('机场推荐添加：')) {
        line = line.replace('机场推荐添加：', 'WgetCloud (高端推荐)').trim();
    }

    const parts = line.split('\t');
    if (parts.length < 5) continue;

    const name = parts[0].trim();
    
    // Skip if already exists in top 11 (疾风云, 肥猫云, 奈云)
    if (name === '疾风云' || name === '肥猫云' || name === '奈云' || name === '奈云机场') {
        continue;
    }

    const tagsStr = parts[1].trim();
    const desc = parts[2].trim();
    const category = parts[3].trim();
    const price = parts[4].trim();

    // Parse tags
    const tags = tagsStr.split('｜').map(t => t.trim());
    let tagsHtml = '';
    tags.forEach(tag => {
        let tagClass = 'tag-blue';
        if (tag.includes('🟩')) tagClass = 'tag-green';
        else if (tag.includes('🟪')) tagClass = 'tag-purple';
        else if (tag.includes('🟧')) tagClass = 'tag-orange';
        tagsHtml += '<span class="tag ' + tagClass + '">' + tag + '</span>\n                            ';
    });

    const cardHtml = '\n' +
'                <!-- ' + counter + '. ' + name + ' -->\n' +
'                <div class="airport-card">\n' +
'                    <div class="airport-header">\n' +
'                        <h3 class="airport-name">' + counter + '. ' + name + '</h3>\n' +
'                        <div class="airport-tags">\n' +
'                            ' + tagsHtml.trim() + '\n' +
'                        </div>\n' +
'                    </div>\n' +
'                    <div class="airport-desc">\n' +
'                        <p>' + desc + '</p>\n' +
'                    </div>\n' +
'                    <div class="airport-features" style="display: flex; gap: 15px; margin-bottom: 20px;">\n' +
'                        <div class="feature-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;"><span class="feature-icon">🏷️</span><div><strong>定位:</strong> ' + category + '</div></div>\n' +
'                        <div class="feature-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;"><span class="feature-icon">💰</span><div><strong>价格:</strong> ' + price + '</div></div>\n' +
'                    </div>\n' +
'                    <div class="airport-action"><a href="#" target="_blank" rel="nofollow noopener" class="btn btn-primary">【官网注册】</a></div>\n' +
'                </div>';
    
    newCardsHtml += cardHtml + '\n';
    counter++;
}

let template = fs.readFileSync('airports.html', 'utf-8');

// Instead of trying to find `</div></div></section>` with \r\n, use a simpler indexOf
const insertPoint = template.lastIndexOf('</div>\n        </div>\n    </section>');
let backupInsertPoint = template.lastIndexOf('</div>\r\n        </div>\r\n    </section>');

if (insertPoint !== -1) {
    template = template.substring(0, insertPoint) + newCardsHtml + template.substring(insertPoint);
} else if (backupInsertPoint !== -1) {
    template = template.substring(0, backupInsertPoint) + newCardsHtml + template.substring(backupInsertPoint);
} else {
    // try removing spaces
    const thirdTry = template.lastIndexOf('</div>\n        </div>\n    </section>'.replace(/\n\s+/g, '\n'));
    if (thirdTry !== -1) {
         template = template.substring(0, thirdTry) + newCardsHtml + template.substring(thirdTry);
    }
}

fs.writeFileSync('airports.html', template);
console.log('Added ' + (counter - 12) + ' new airports to airports.html');
