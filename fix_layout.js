const fs = require('fs');

let template = fs.readFileSync('airports.html', 'utf-8');

const startMarker = '                <!-- 12. WgetCloud (高端推荐) -->';
const startIdx = template.indexOf(startMarker);
if (startIdx === -1) {
    console.log("Could not find start marker.");
    process.exit(1);
}

// Find the end of the injected cards.
const endMarker = '<!-- 51. 一元机场 -->';
const endCardIdx = template.indexOf(endMarker, startIdx);
// Find the end of the 51st card's div
let endIdx = template.indexOf('</div>', endCardIdx);
endIdx = template.indexOf('</div>', endIdx + 1); // inner div
endIdx = template.indexOf('</div>', endIdx + 1); // another inner div
endIdx = template.indexOf('</div>', endIdx + 1); // another inner div
endIdx = template.indexOf('</div>', endIdx + 1); // outer div

if (endIdx === -1) {
    console.log("Could not find end of injected cards.");
    process.exit(1);
}

// Add length of </div>
endIdx += 6; 
// Plus whatever trailing newlines exist before the FAQ closes
// It's probably just `</div>\n`

const injectedCards = template.substring(startIdx, endIdx);

// Remove the injected cards from their current wrong position
template = template.substring(0, startIdx) + template.substring(endIdx);

// Now find the correct place to inject them.
const targetStr = '                            </div>\\n        </div>\\n    </section>\\n\\n    <!-- FAQ -->';
const targetStrWindows = '                            </div>\\r\\n        </div>\\r\\n    </section>\\r\\n\\r\\n    <!-- FAQ -->';

let insertIdx = template.indexOf(targetStr);
let useWindows = false;

if (insertIdx === -1) {
    insertIdx = template.indexOf(targetStrWindows);
    useWindows = true;
}

if (insertIdx === -1) {
    const faqIdx = template.indexOf('<!-- FAQ -->');
    insertIdx = template.lastIndexOf('                            </div>', faqIdx);
    if (insertIdx !== -1) {
        template = template.substring(0, insertIdx) + injectedCards + '\\n' + template.substring(insertIdx);
        console.log("Fixed by finding FAQ backwards.");
        fs.writeFileSync('airports.html', template);
        process.exit(0);
    }
    
    console.log("Could not find insertion point.");
    process.exit(1);
}

template = template.substring(0, insertIdx) + injectedCards + '\\n' + template.substring(insertIdx);
fs.writeFileSync('airports.html', template);
console.log('Fixed layout successfully!');
