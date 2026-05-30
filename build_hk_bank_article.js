const fs = require('fs');

const templatePath = 'article-vpn-trends-2026.html';
let template = fs.readFileSync(templatePath, 'utf-8');

// Title
const newTitle = '2026年香港银行开户全路径解析：大陆用户可行方案、银行清单与官方通道 | 翻茄笔记';
template = template.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);

// h1
template = template.replace(/<h1 class="hero-title"([^>]*)>.*?<\/h1>/, `<h1 class="hero-title"$1>2026年香港银行开户全路径解析：大陆用户可行方案、银行清单与官方通道</h1>`);

// subtitle
template = template.replace(/<p class="hero-subtitle"([^>]*)>.*?<\/p>/, `<p class="hero-subtitle"$1>开户不是技术问题，而是：资金来源清晰、用途合理、信息一致</p>`);

// meta desc
const newMetaDesc = "2026年香港银行开户全路径解析：大陆用户可行方案、银行清单与官方通道。详细介绍汇丰、中银、渣打、ZA Bank等银行开户流程。";
template = template.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${newMetaDesc}">`);

const newArticleContent = `
<div class="article-body">
    <p class="lead-text">开户不是技术问题，而是：资金来源清晰、用途合理、信息一致</p>

    <h2>一、最推荐（普通人优先）</h2>

    <h3>1. 汇丰银行（HSBC HK）</h3>
    <p>📱 <strong>官方App（必须用这个）</strong><br>
    名称：HSBC HK Mobile Banking（简称 HSBC HK App）<br>
    下载方式：<br>
    官网下载指引：<br>
    <a href="https://www.hsbc.com.hk/zh-hk/ways-to-bank/mobile-apps/banking/" target="_blank">汇丰银行香港</a><br>
    Google Play：<br>
    <a href="https://play.google.com/store/apps/details?id=hk.com.hsbc.hsbchkmobilebanking" target="_blank">Google Play</a><br>
    App Store：<br>
    <a href="https://apps.apple.com/hk/app/hsbc-hk-mobile-banking/id1164066737" target="_blank">App Store</a>
    </p>

    <p>🧭 <strong>开户入口</strong><br>
    官方开户页面：<br>
    <a href="https://www.hsbc.com.hk/ways-to-bank/mobile-apps/banking/account-opening/" target="_blank">汇丰银行香港</a></p>

    <p>🧩 <strong>开户方式</strong></p>
    <ul>
    <li>方式1：App开户（推荐）</li>
    <li>方式2：官网预约 + 线下网点</li>
    </ul>

    <p>📌 <strong>App开户流程（关键步骤）</strong></p>
    <ol>
    <li>下载「HSBC HK App」</li>
    <li>选择：“I don’t have an account”</li>
    <li>上传证件（身份证 + 通行证）</li>
    <li>人脸识别</li>
    <li>填写开户用途</li>
    <li>提交审核（1–7天）</li>
    </ol>
    <p>👉官方说明：可通过App完成开户流程，几分钟内完成</p>
    <p>⚠️ <strong>注意</strong>：大陆用户通常需要入境香港激活。App主要面向香港用户，但仍可申请。</p>

    <h3>2. 中银香港（Bank of China HK）</h3>
    <p>📱 <strong>官方App</strong><br>
    名称：BOCHK Mobile Banking<br>
    Google Play：<br>
    <a href="https://play.google.com/store/apps/details?id=com.bochk.app.aos" target="_blank">Google Play</a></p>

    <p>🧭 <strong>开户入口</strong><br>
    官方开户页面：<br>
    <a href="https://www.bochk.com/en/more/ebanking/bba.html" target="_blank">中银香港</a></p>

    <p>🧩 <strong>开户方式</strong></p>
    <ul>
    <li>App开户（部分用户）</li>
    <li>线下网点（主流）</li>
    </ul>

    <p>📌 <strong>App开户能力</strong></p>
    <ul>
    <li>支持线上开户</li>
    <li>可几分钟完成申请</li>
    </ul>

    <p>⚠️ <strong>注意</strong>：非香港居民线上成功率较低，建议直接线下开户。</p>

    <h3>3. 渣打银行（Standard Chartered HK）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.sc.com/hk/" target="_blank">https://www.sc.com/hk/</a></p>

    <p>🧭 <strong>开户方式</strong></p>
    <ul>
    <li>官网预约</li>
    <li>线下网点开户</li>
    </ul>

    <p>📌 <strong>特点</strong>：部分支持远程开户，需较高资产证明。</p>

    <h2>二、中等推荐（可用但有限制）</h2>

    <h3>4. 恒生银行（Hang Seng Bank）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.hangseng.com/" target="_blank">https://www.hangseng.com/</a></p>

    <p>🧭 <strong>开户方式</strong></p>
    <ul>
    <li>官网预约</li>
    <li>线下网点</li>
    </ul>

    <p>📌 <strong>特点</strong>：汇丰子公司，本地使用体验好。</p>

    <h3>5. 工银亚洲（ICBC Asia）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.icbcasia.com/" target="_blank">https://www.icbcasia.com/</a></p>

    <p>🧭 <strong>开户方式</strong>：线下开户为主，部分支持线上申请。</p>

    <h3>6. 招商永隆银行（CMB Wing Lung）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.cmbwinglungbank.com/" target="_blank">https://www.cmbwinglungbank.com/</a></p>

    <p>🧭 <strong>开户方式</strong>：线下为主，招行用户更容易通过。</p>

    <h2>三、高门槛银行（慎选）</h2>

    <h3>7. 花旗银行香港（Citibank HK）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.citibank.com.hk/" target="_blank">https://www.citibank.com.hk/</a></p>
    <p>📌 <strong>特点</strong>：高净值用户，资金门槛较高。</p>

    <h3>8. 东亚银行（BEA）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.hkbea.com/" target="_blank">https://www.hkbea.com/</a></p>
    <p>📌 <strong>特点</strong>：审核严格，更偏企业客户。</p>

    <h2>四、虚拟银行（最简单路径）</h2>

    <h3>9. ZA Bank（众安银行）</h3>
    <p>📱 <strong>官方App</strong><br>
    下载页面：<br>
    <a href="https://bank.za.group/en/app-download" target="_blank">ZA银行</a><br>
    App Store：<br>
    <a href="https://apps.apple.com/us/app/za-bank/id1477150600" target="_blank">App Store</a></p>

    <p>🧭 <strong>开户入口</strong><br>
    官网：<a href="https://bank.za.group/en/account-open" target="_blank">ZA银行</a></p>

    <p>🧩 <strong>开户方式</strong>：全程App开户</p>
    <p>📌 <strong>开户能力</strong>：最快2分钟开户</p>
    <p>⚠️ <strong>注意</strong>：必须在香港定位（GPS），非完全替代传统银行。</p>

    <h3>10. 天星银行（Airstar Bank）</h3>
    <p>📱 <strong>官方入口</strong><br>
    官网：<a href="https://www.airstarbank.com/" target="_blank">https://www.airstarbank.com/</a></p>
    <p>🧩 <strong>开户方式</strong>：App开户</p>
    <p>📌 <strong>特点</strong>：类似ZA Bank，功能略少。</p>

    <h2>五、最终推荐策略（直接照做）</h2>

    <p>✅ <strong>普通用户最优组合</strong></p>
    <ul>
    <li><strong>主账户：</strong>汇丰（HSBC HK）、中银香港（BOCHK）</li>
    <li><strong>备用账户：</strong>ZA Bank</li>
    </ul>

    <h2>六、核心流程总结（极简）</h2>

    <div class="highlight-box">
    <ul>
    <li><strong>Step 1:</strong> 下载银行App（HSBC / ZA）</li>
    <li><strong>Step 2:</strong> 提交开户申请（App完成）</li>
    <li><strong>Step 3:</strong> 准备材料：身份证、港澳通行证、地址证明</li>
    <li><strong>Step 4:</strong> 赴港一次（激活）</li>
    </ul>
    </div>

    <h2>七、关键认知（本质）</h2>
    <p>开户不是技术问题，而是：</p>
    <ul>
    <li>👉 <strong>是否满足银行风控：</strong></li>
    <li>资金来源清晰</li>
    <li>用途合理</li>
    <li>信息一致</li>
    </ul>
</div>
`;

template = template.replace(/<div class="article-body">[\s\S]*?<\/div>/, newArticleContent);

fs.writeFileSync('article-hk-bank-account-2026.html', template);
console.log('Successfully rewrote article-hk-bank-account-2026.html');
