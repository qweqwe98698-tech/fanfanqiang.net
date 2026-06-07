// Mobile Navigation Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// FAQ Accordion
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        // Close other open items
        const currentlyActive = document.querySelector('.accordion-item.active');
        if (currentlyActive && currentlyActive !== item) {
            currentlyActive.classList.remove('active');
        }
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Inject Mobile Sticky CTA
document.addEventListener('DOMContentLoaded', () => {
    // Only inject on mobile
    if (window.innerWidth <= 768) {
        const stickyCtaHtml = `
            <div class="mobile-sticky-cta" id="mobileStickyCta">
                <div class="sticky-cta-text">
                    <span class="sticky-cta-title">🏆 2026 稳定推荐：晚高峰秒开4K</span>
                    <span class="sticky-cta-subtitle">含 ChatGPT / Netflix 解锁专属节点</span>
                </div>
                <a href="airports.html" class="sticky-cta-btn">查看排名 ✈️</a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', stickyCtaHtml);

        const stickyCta = document.getElementById('mobileStickyCta');
        
        // Show after scrolling 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }
});

// One-Click Copy functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create toast element globally
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '✅ 优惠码复制成功！去官网粘贴吧';
    document.body.appendChild(toast);

    // Event delegation for dynamically added promo boxes
    document.body.addEventListener('click', (e) => {
        const promoBox = e.target.closest('.promo-box');
        if (!promoBox) return;

        const code = promoBox.getAttribute('data-code');
        if (!code) return;

        navigator.clipboard.writeText(code).then(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }).catch(err => {
            console.error('Copy failed', err);
        });
    });
});
