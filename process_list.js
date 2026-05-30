const fs = require('fs');

const rawData = fs.readFileSync('list.txt', 'utf-8');

const lines = rawData.split('\\n');
let newCardsHtml = '';
let counter = 12;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('机场推荐添加：')) {
        line = line.replace('机场推荐添加：', 'WgetCloud (高端推荐)').trim();
    }

    const parts = line.split(/\\t| {2,}/);
    
    let validParts = [];
    for(let p of parts) {
        if(p.trim().length > 0) validParts.push(p.trim());
    }

    if (validParts.length < 5) continue;

    let name = validParts[0];
    
    // Some names might have the tags merged if whitespace is lost, but let's assume they are fine
    if (name === '疾风云' || name === '肥猫云' || name === '奈云' || name === '奈云机场') {
        continue;
    }

    const tagsStr = validParts[1];
    const desc = validParts[2];
    const category = validParts[3];
    const price = validParts[4];

    const tags = tagsStr.split('｜').map(t => t.trim());
    let tagsHtml = '';
    tags.forEach(tag => {
        let tagClass = 'tag-blue';
        if (tag.includes('🟩')) tagClass = 'tag-green';
        else if (tag.includes('🟪')) tagClass = 'tag-purple';
        else if (tag.includes('🟧')) tagClass = 'tag-orange';
        tagsHtml += '<span class="tag ' + tagClass + '">' + tag + '</span>\\n                            ';
    });

    const cardHtml = '\\n' +
'                <!-- ' + counter + '. ' + name + ' -->\\n' +
'                <div class="airport-card">\\n' +
'                    <div class="airport-header">\\n' +
'                        <h3 class="airport-name">' + counter + '. ' + name + '</h3>\\n' +
'                        <div class="airport-tags">\\n' +
'                            ' + tagsHtml.trim() + '\\n' +
'                        </div>\\n' +
'                    </div>\\n' +
'                    <div class="airport-desc">\\n' +
'                        <p>' + desc + '</p>\\n' +
'                    </div>\\n' +
'                    <div class="airport-features" style="display: flex; gap: 15px; margin-bottom: 20px;">\\n' +
'                        <div class="feature-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;"><span class="feature-icon">🏷️</span><div><strong>定位:</strong> ' + category + '</div></div>\\n' +
'                        <div class="feature-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;"><span class="feature-icon">💰</span><div><strong>价格:</strong> ' + price + '</div></div>\\n' +
'                    </div>\\n' +
'                    <div class="airport-action"><a href="#" target="_blank" rel="nofollow noopener" class="btn btn-primary">【官网注册】</a></div>\\n' +
'                </div>';
    
    newCardsHtml += cardHtml + '\\n';
    counter++;
}

let template = fs.readFileSync('airports.html', 'utf-8');

const insertTarget = '                            </div>\\r\\n        </div>\\r\\n    </section>';
const insertTarget2 = '                            </div>\\n        </div>\\n    </section>';

if (template.includes(insertTarget)) {
    template = template.replace(insertTarget, newCardsHtml + '\\n' + insertTarget);
} else {
    template = template.replace(insertTarget2, newCardsHtml + '\\n' + insertTarget2);
}

fs.writeFileSync('airports.html', template);
console.log('Added ' + (counter - 12) + ' new airports to airports.html');
