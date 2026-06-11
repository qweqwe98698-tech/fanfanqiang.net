const fs = require('fs');

const htmlFile = 'apple-id-shared.html';
let content = fs.readFileSync(htmlFile, 'utf8');

if (!content.includes('application/ld+json')) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "提示“账号已锁定”或“已停用”怎么办？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "由于共享账号使用人数较多，频繁异地登录会触发苹果的安全机制导致锁定。遇到此情况，请不要尝试解锁，直接刷新本页面，选择另一个正常的备用账号登录即可。"
          }
        },
        {
          "@type": "Question",
          "name": "能在“设置”或“iCloud”里面登录吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "绝对不可以！这是非常危险的行为。在设置中登录可能会导致你的通讯录、相册等隐私数据被同步到共享账号泄露。一旦共享账号被苹果封禁，你的设备将被远程锁定变砖。"
          }
        },
        {
          "@type": "Question",
          "name": "如何更新以前下载的 App？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "共享账号的密码会定期更换以保证安全。你无法直接点击“更新”旧应用（因为会要求输入旧密码）。正确做法是：先长按卸载需要更新的 App，然后登录最新的共享账号，在商店里重新搜索并下载最新版本。"
          }
        },
        {
          "@type": "Question",
          "name": "可以购买付费软件或应用内购吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "强烈不建议。如果你对共享账号充值购买了软件（如 Shadowrocket），一旦账号因风险被封，你购买的软件和余额将彻底丢失。如有付费需求，请务必自行注册私人的美区 Apple ID。"
          }
        }
      ]
    };

    const scriptTag = `\n<!-- Schema.org FAQ -->\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n`;
    content = content.replace('</body>', scriptTag + '</body>');
    fs.writeFileSync(htmlFile, content);
    console.log(`Successfully injected FAQ Schema into ${htmlFile}`);
} else {
    console.log('Schema already exists.');
}
