// Country dialing codes for phone registration - shared across auth pages
window.COUNTRY_CODES = [
  { code: '+86', flag: '🇨🇳', name: '中国' },
  { code: '+852', flag: '🇭🇰', name: '香港' },
  { code: '+853', flag: '🇲🇴', name: '澳门' },
  { code: '+886', flag: '🇹🇼', name: '台湾' },
  { code: '+1', flag: '🇺🇸', name: '美国' },
  { code: '+44', flag: '🇬🇧', name: '英国' },
  { code: '+81', flag: '🇯🇵', name: '日本' },
  { code: '+82', flag: '🇰🇷', name: '韩国' },
  { code: '+65', flag: '🇸🇬', name: '新加坡' },
  { code: '+60', flag: '🇲🇾', name: '马来西亚' },
  { code: '+66', flag: '🇹🇭', name: '泰国' },
  { code: '+63', flag: '🇵🇭', name: '菲律宾' },
  { code: '+61', flag: '🇦🇺', name: '澳大利亚' },
  { code: '+64', flag: '🇳🇿', name: '新西兰' },
  { code: '+49', flag: '🇩🇪', name: '德国' },
  { code: '+33', flag: '🇫🇷', name: '法国' },
  { code: '+39', flag: '🇮🇹', name: '意大利' },
  { code: '+34', flag: '🇪🇸', name: '西班牙' },
  { code: '+31', flag: '🇳🇱', name: '荷兰' },
  { code: '+41', flag: '🇨🇭', name: '瑞士' },
  { code: '+7', flag: '🇷🇺', name: '俄罗斯' },
  { code: '+55', flag: '🇧🇷', name: '巴西' },
  { code: '+91', flag: '🇮🇳', name: '印度' },
  { code: '+971', flag: '🇦🇪', name: '阿联酋' },
  { code: '+966', flag: '🇸🇦', name: '沙特阿拉伯' },
  { code: '+27', flag: '🇿🇦', name: '南非' },
  { code: '+52', flag: '🇲🇽', name: '墨西哥' },
  { code: '+54', flag: '🇦🇷', name: '阿根廷' }
];

// Populate a <select> with country codes (flag + code), preserving selected value
window.populateCountryCodes = function(select, selectedCode) {
  if (!select) return;
  select.innerHTML = '';
  COUNTRY_CODES.forEach(function(c) {
    var opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.flag + ' ' + c.code + ' ' + c.name;
    opt.dataset.name = c.name;
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
