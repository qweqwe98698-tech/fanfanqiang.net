const fs = require('fs');

const rawData = `机场推荐添加：	🟦 Trojan｜🟩 IEPL专线｜🟪 高端稳定	适合外贸、开发、AI 工具和长期稳定使用用户，主打稳定和自定义套餐。	高端稳定专线机场	约 ¥59-89/月，140G-180G	【官网注册】
悠兔	🟩 IEPL专线｜🟪 稳定中转｜🟧 新手适合	线路分层清楚，适合日常浏览、视频、ChatGPT 和多设备使用。	稳定中转机场	约 ¥39/月 150G 起	【官网注册】
BoostNet	🟩 IEPL专线｜🟦 AnyTLS｜🟪 精品小众	适合追求低延迟、晚高峰稳定和专线体验的用户。	精品专线机场	约 ¥49/月 200G 起	【官网注册】
TAG	🟩 IEPL专线｜🟪 冷门节点多｜🟦 SS协议	适合需要全球多地区、流媒体解锁、家宽/原生 IP 节点的用户。	全球节点型机场	约 ¥154/年 200G 起	【官网注册】
Kycloud	🟩 IEPL专线｜🟦 SS/Vmess｜🟪 老牌稳定	多年运营，节点地区丰富，适合长期主力或备用。	老牌稳定机场	约 ¥150/年 120G 起	【官网注册】
贝贝云	🟦 AnyTLS｜🟪 高性价比｜🟧 新手适合	套餐梯度清晰，适合日常访问、视频和 AI 工具。	高性价比中转机场	约 ¥24.9/月 100G 起	【官网注册】
FlyingBird 飞鸟机场	🟦 SS协议｜🟩 IPLC专线｜🟪 流媒体解锁	适合看 Netflix、Disney+、YouTube 和日常高速访问。	流媒体专线机场	¥15/月 100G 起	【官网注册】
Edge-X	🟦 AnyTLS｜🟩 专线中转｜🟪 新站体验	有试用，适合先测试再购买的用户。	新手试用机场	约 ¥22.8/月 200G 起	【官网注册】
Recmata	🟦 VLESS Reality｜🟩 直连优化｜🟪 电信友好	适合想尝试 Reality / Hy2 直连线路的进阶用户。	直连优化机场	约 ¥22/月 70G 起	【官网注册】
海獭	🟦 Trojan｜🟪 高性价比｜🟩 中转机场	价格低、流量分层多，适合备用和日常使用。	便宜中转机场	约 ¥15.99/月 100G 起	【官网注册】
Web3加速器	🟦 SS协议｜🟩 IEPL｜🟪 老牌稳定	运营时间较长，适合需要主流地区节点和稳定体验的用户。	老牌 IEPL 机场	约 ¥25/月 200G 起	【官网注册】
优信云	🟦 Trojan｜🟪 节点多｜🟧 入门便宜	节点数量多，适合预算有限、需要多地区选择的用户。	便宜节点型机场	约 ¥15/月 100G 起	【官网注册】
疾风云	🟦 Vmess｜🟪 多套餐｜🟧 入门便宜	套餐等级丰富，适合从低价体验逐步升级。	入门中转机场	约 ¥9.99/月 50G 起	【官网注册】
EdNovas 云	🟦 Vmess｜🟪 冷门节点｜🟩 IEPL/隧道	适合需要冷门国家节点、回国节点或特殊地区访问的用户。	冷门节点机场	约 ¥10/月 50G 起	【官网注册】
STC-SERVER	🟦 SSR/Vmess｜🟪 按量付费｜🟩 老牌	适合不想固定月付、希望按量购买的用户。	按量付费机场	约 0.8元/G 起	【官网注册】
365VPNN	🟪 多地区｜🟧 客户端型｜🟦 新手适合	适合想用官方客户端、减少配置步骤的新手。	客户端型机场	约 ¥13.99/周卡	【官网注册】
跑路云	🟦 SS2022｜🟦 AnyTLS｜🟪 多线路	适合需要中转与直连混合线路的用户。	混合线路机场	约 ¥8/月 80G 起	【官网注册】
xxyun	🟪 高性价比｜🟩 BGP中转｜🟧 新手适合	价格低、流量大，适合预算优先和日常视频用户。	低价高流量机场	¥9.99/月 100G 起	【官网注册】
奈云	🟪 老牌机场｜🟧 多套餐｜🟩 节点多	适合想要老牌服务和大流量套餐的用户。	老牌综合机场	约 ¥128/年 168G/月	【官网注册】
CocoDuck	🟪 高性价比｜🟧 新手适合｜🟩 全球节点	套餐名称清晰，适合轻度、日常和多设备用户。	新手友好机场	¥15/月 150G 起	【官网注册】
网际快车	🟪 不限时流量｜🟧 多设备｜🟩 备用线路	适合低频使用、备用线路和家庭多设备场景。	不限时流量机场	¥6.8 / 20G 不限时起	【官网注册】
阿达西	🟪 超低价｜🟧 轻量使用｜🟩 入门备用	适合偶尔使用、预算很低的新手用户。	超低价备用机场	¥3/月 20G 起	【官网注册】
老头 VPN	🟪 老牌稳定｜🟧 新手适合｜🟩 国际加速	适合更看重长期运营和服务稳定性的用户。	老牌综合加速	¥25/月 150G 起	【官网注册】
uuone	🟪 高性价比｜🟩 BGP中转｜🟧 新手适合	套餐流量充裕，适合刷视频、AI 工具和多设备日常。	性价比中转机场	¥12/月 150G 起	【官网注册】
隐云	🟩 IPLC/IEPL/BGP｜🟧 专属客户端｜🟪 高可用	适合想要专属客户端和通用订阅双模式的用户。	企业级线路机场	¥25/月 150G 起	【官网注册】
唯兔云	🟦 Trojan｜🟪 高性价比｜🟧 新手适合	套餐结构接近一云梯，适合轻度到重度用户快速选择。	新手套餐型机场	¥14.9/月 100G 起	【官网注册】
冲上云霄	🟪 低价｜🟧 入门体验｜🟩 节点质量尚可	适合低预算用户先体验线路。	低价体验机场	¥5/月 80G 起	【官网注册】
星岛梦	🟦 Trojan/SS｜🟩 IEPL专线｜🟪 流媒体/AI	适合跨境电商、远程办公、AI 工具和视频用户。	高品质 IEPL 机场	¥16/月 100G 起	【官网注册】
Danke	🟦 AnyTLS｜🟪 极低价｜🟧 体验友好	适合低成本试用、大流量和不限时备用用户。	低价大流量机场	¥3/月 88G 起	【官网注册】
ccyz	🟩 BGP+IEPL｜🟪 高性价比｜🟧 日常主力	适合影音、AI 工具和长期稳定使用。	专线性价比机场	¥15/月 150G 起	【官网注册】
okanc	🟩 高质量节点｜🟪 电商/游戏｜🟧 高需求用户	价格偏高，适合对延迟和节点质量要求高的人群。	高质量节点机场	¥46/月 328G 起	【官网注册】
纵云梯	🟪 低价｜🟧 试用友好｜🟩 新站体验	适合先试用、再决定是否长期使用的用户。	入门试用机场	¥10 / 60G / 30天起	【官网注册】
掌中世界	🟪 流媒体解锁｜🟧 客服在线｜🟩 稳定节点	适合想要试用、客服响应和日常观看视频的用户。	日常稳定机场	¥18/月 100G 起	【官网注册】
迅达	🟪 高性价比｜🟩 多国节点｜🟧 多设备	节点覆盖广，适合 Netflix、YouTube、TikTok、ChatGPT 等日常场景。	多地区综合机场	¥15/月 120G 起	【官网注册】
Fanrr Cloud	🟩 高速专线｜🟪 速度优先｜🟧 视频用户	适合追求高速、低延迟和高清流媒体的用户。	高速专线机场	¥15.9/月 100G 起	【官网注册】
OK CLOUD	🟪 稳定高速｜🟧 轻中度用户｜🟩 日常访问	适合社交媒体、视频观看和轻度 AI 工具使用。	日常稳定机场	¥8.9/月 50G 起	【官网注册】
Akkocloud	🟩 IEPL专线｜🟦 SS/V2Ray｜🟪 老牌稳定	主打深港/沪日 IEPL，适合多平台和稳定访问需求。	IEPL 老牌机场	年付低价套餐约 ¥99 起	【官网注册】
鹿语云	🟪 推荐页常见｜🟧 新手适合｜🟩 综合线路	适合放在综合推荐页中作为新手备用选择。	综合备用机场	以官网为准	【官网注册】
肥猫云	🟪 性价比｜🟧 新手适合｜🟩 日常访问	适合轻度浏览、视频和常见客户端订阅导入。	性价比机场	以官网为准	【官网注册】
Totoro Cloud	🟦 SS协议｜🟩 IPLC专线｜🟪 新手指导	适合第一次使用机场的新手用户，主打专线和远程指导。	新手专线机场	¥15/月 100G 起	【官网注册】
Just My Socks	🟦 SS/Vmess｜🟪 大厂背景｜🟩 稳定备用	适合担心小机场跑路、希望选择更稳妥服务的用户。	稳定备用机场	美元计价，约 $5.8/月起	【官网注册】
极客云	🟦 V2Ray/SSR/Trojan｜🟪 老牌推荐｜🟧 可试用	适合想按月购买、先试用再决定的用户。	老牌 V2Ray 机场	约 ¥25/月起	【官网注册】
一元机场	🟪 超低价｜🟧 备用线路｜🟩 入门体验	适合低成本备用，不建议作为唯一主力线路。	低价备用机场	以官网为准	【官网注册】`;

const lines = rawData.split('\\n');
let newCardsHtml = '';
let counter = 12; // Start from 12 since we have 11 already

for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('机场推荐添加：')) {
        line = line.replace('机场推荐添加：', 'WgetCloud (高端推荐)').trim();
    }

    const parts = line.split(/\\t| {2,}/);
    
    // Fallback if parts is weird:
    let validParts = [];
    for(let p of parts) {
        if(p.trim().length > 0) validParts.push(p.trim());
    }

    if (validParts.length < 5) continue;

    const name = validParts[0];
    
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
