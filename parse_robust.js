const fs = require('fs');

const rawData = fs.readFileSync('list.txt', 'utf-8');
const lines = rawData.split('\\n');

let newCardsHtml = '';
let counter = 12;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    const emojiRegex = /[🟦🟩🟪🟧]/;
    const match = emojiRegex.exec(line);
    if (!match) continue;

    const emojiIndex = match.index;
    let name = line.substring(0, emojiIndex).trim();
    if (name.startsWith('机场推荐添加：')) name = 'WgetCloud (高端推荐)';
    if (!name) name = '精品推荐机场';

    // Skip duplicates
    if (name === '疾风云' || name === '肥猫云' || name === '奈云' || name === '奈云机场') {
        continue;
    }

    const restAfterName = line.substring(emojiIndex);
    const withoutLink = restAfterName.replace(/【官网注册】/g, '').trim();

    const lastPipeIndex = withoutLink.lastIndexOf('｜');
    let spaceAfterPipe = withoutLink.indexOf(' ', lastPipeIndex);
    
    // Handling case where space is missing
    if (spaceAfterPipe === -1) spaceAfterPipe = withoutLink.length;
    // Walk forward if the next characters belong to the last tag
    while(spaceAfterPipe < withoutLink.length && !withoutLink[spaceAfterPipe].match(/\s/)) {
        spaceAfterPipe++;
    }

    const tagsStr = withoutLink.substring(0, spaceAfterPipe).trim();
    const restAfterTags = withoutLink.substring(spaceAfterPipe).trim();

    let priceStr = '以官网为准';
    let beforePrice = restAfterTags;
    
    // Look for price patterns
    const priceMatch = restAfterTags.match(/(?:约\s*)?[¥$]\d+.*$/) || 
                       restAfterTags.match(/\d+(\.\d+)?元\/G.*$/) || 
                       restAfterTags.match(/以官网为准/);
                       
    if (priceMatch) {
        priceStr = priceMatch[0];
        beforePrice = restAfterTags.substring(0, priceMatch.index).trim();
    }

    let category = '推荐机场';
    let desc = beforePrice;
    
    // Find category: the last word
    const categoryMatch = beforePrice.match(/\s+([^\s]+(?:机场|加速|线路|体验|直连))$/);
    if (categoryMatch) {
        category = categoryMatch[1];
        desc = beforePrice.substring(0, categoryMatch.index).trim();
    } else {
        const lastSpace = beforePrice.lastIndexOf(' ');
        if(lastSpace !== -1) {
            category = beforePrice.substring(lastSpace + 1).trim();
            desc = beforePrice.substring(0, lastSpace).trim();
        } else {
            category = beforePrice;
            desc = '';
        }
    }

    // Process Tags
    // The tags string might look like "🟩 IEPL专线｜🟪 稳定中转｜🟧 新手适合"
    const tags = tagsStr.split('｜').map(t => t.trim());
    let tagsHtml = '';
    tags.forEach(tag => {
        if(!tag) return;
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
'                        <div class="feature-item" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;"><span class="feature-icon">💰</span><div><strong>价格:</strong> ' + priceStr + '</div></div>\\n' +
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
