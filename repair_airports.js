const fs = require('fs');

let airportsHtml = fs.readFileSync('airports.html', 'utf-8');
let indexHtml = fs.readFileSync('index.html', 'utf-8');

// The original 11 airports end right before `<!-- FAQ -->`
const faqMarker = '<!-- FAQ -->';
const firstFaqIdx = airportsHtml.indexOf(faqMarker);

if (firstFaqIdx === -1) {
    console.log("Could not find FAQ marker in airports.html");
    process.exit(1);
}

// Get the pristine top part of airports.html
let topPart = airportsHtml.substring(0, firstFaqIdx);

// We need to inject the new cards INSIDE the airports grid.
// The grid ends with:
//                             </div>
//         </div>
//     </section>
// (which is at the very end of topPart)
const gridEndStr = '                            </div>\\n        </div>\\n    </section>';
const gridEndStrWin = '                            </div>\\r\\n        </div>\\r\\n    </section>';
let insertIdx = topPart.lastIndexOf(gridEndStr);
if (insertIdx === -1) {
    insertIdx = topPart.lastIndexOf(gridEndStrWin);
}

if (insertIdx === -1) {
    // fallback: just find the last </div></section> equivalent
    insertIdx = topPart.lastIndexOf('</div>');
    insertIdx = topPart.lastIndexOf('</div>', insertIdx - 1);
    insertIdx = topPart.lastIndexOf('</div>', insertIdx - 1);
}

let beforeCards = topPart.substring(0, insertIdx);
let afterCards = topPart.substring(insertIdx);

// Now generate the cards again
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

    const parts = line.split('\\t');
    if (parts.length < 5) continue;

    const name = parts[0].trim();
    if (name === '疾风云' || name === '肥猫云' || name === '奈云' || name === '奈云机场') continue;

    const tagsStr = parts[1].trim();
    const desc = parts[2].trim();
    const category = parts[3].trim();
    const price = parts[4].trim();

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

// Extract FAQ and Footer from index.html
const indexFaqIdx = indexHtml.indexOf(faqMarker);
const faqAndFooter = indexHtml.substring(indexFaqIdx);

// Assemble the final file
const finalHtml = beforeCards + newCardsHtml + '\\n' + afterCards + '\\n\\n    ' + faqAndFooter;

fs.writeFileSync('airports.html', finalHtml);
console.log('Successfully repaired airports.html and added ' + (counter - 12) + ' new airports correctly!');
