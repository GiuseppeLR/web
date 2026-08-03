// Country dialing codes for phone registration - shared across auth pages
window.COUNTRY_CODES = [
  { code: '+86', flag: '🇨🇳', name: '中国', nameEn: 'China' },
  { code: '+852', flag: '🇭🇰', name: '香港', nameEn: 'Hong Kong' },
  { code: '+853', flag: '🇲🇴', name: '澳门', nameEn: 'Macao' },
  { code: '+886', flag: '🇹🇼', name: '台湾', nameEn: 'Taiwan' },
  { code: '+1', flag: '🇺🇸', name: '美国', nameEn: 'United States' },
  { code: '+44', flag: '🇬🇧', name: '英国', nameEn: 'United Kingdom' },
  { code: '+81', flag: '🇯🇵', name: '日本', nameEn: 'Japan' },
  { code: '+82', flag: '🇰🇷', name: '韩国', nameEn: 'South Korea' },
  { code: '+65', flag: '🇸🇬', name: '新加坡', nameEn: 'Singapore' },
  { code: '+60', flag: '🇲🇾', name: '马来西亚', nameEn: 'Malaysia' },
  { code: '+66', flag: '🇹🇭', name: '泰国', nameEn: 'Thailand' },
  { code: '+63', flag: '🇵🇭', name: '菲律宾', nameEn: 'Philippines' },
  { code: '+61', flag: '🇦🇺', name: '澳大利亚', nameEn: 'Australia' },
  { code: '+64', flag: '🇳🇿', name: '新西兰', nameEn: 'New Zealand' },
  { code: '+49', flag: '🇩🇪', name: '德国', nameEn: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: '法国', nameEn: 'France' },
  { code: '+39', flag: '🇮🇹', name: '意大利', nameEn: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: '西班牙', nameEn: 'Spain' },
  { code: '+31', flag: '🇳🇱', name: '荷兰', nameEn: 'Netherlands' },
  { code: '+41', flag: '🇨🇭', name: '瑞士', nameEn: 'Switzerland' },
  { code: '+7', flag: '🇷🇺', name: '俄罗斯', nameEn: 'Russia' },
  { code: '+55', flag: '🇧🇷', name: '巴西', nameEn: 'Brazil' },
  { code: '+91', flag: '🇮🇳', name: '印度', nameEn: 'India' },
  { code: '+971', flag: '🇦🇪', name: '阿联酋', nameEn: 'United Arab Emirates' },
  { code: '+966', flag: '🇸🇦', name: '沙特阿拉伯', nameEn: 'Saudi Arabia' },
  { code: '+27', flag: '🇿🇦', name: '南非', nameEn: 'South Africa' },
  { code: '+52', flag: '🇲🇽', name: '墨西哥', nameEn: 'Mexico' },
  { code: '+54', flag: '🇦🇷', name: '阿根廷', nameEn: 'Argentina' }
];

// Detect page language from <html lang="..."> attribute
function getPageLang() {
  var lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  return lang.indexOf('zh') === 0 ? 'zh' : 'en';
}

// Populate a <select> with country codes (flag + code + localized name),
// preserving selected value
window.populateCountryCodes = function(select, selectedCode) {
  if (!select) return;
  var isZh = getPageLang() === 'zh';
  select.innerHTML = '';
  COUNTRY_CODES.forEach(function(c) {
    var opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.flag + ' ' + c.code + ' ' + (isZh ? c.name : c.nameEn);
    opt.dataset.name = isZh ? c.name : c.nameEn;
    if (c.code === selectedCode) opt.selected = true;
    select.appendChild(opt);
  });
};

// Countdown helper for "resend code" button
window.startOtpCountdown = function(btn, seconds) {
  var remaining = seconds;
  btn.disabled = true;
  var original = btn.textContent;
  var timer = setInterval(function() {
    remaining--;
    if (remaining <= 0) {
      clearInterval(timer);
      btn.disabled = false;
      btn.textContent = original;
    } else {
      btn.textContent = original + ' (' + remaining + 's)';
    }
  }, 1000);
};
