// Cloudflare Turnstile 验证工具
// 使用方法：
// 1. 在页面中引入 <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
// 2. 在表单中添加 <div class="cf-turnstile" data-sitekey="YOUR_KEY"></div>
// 3. 提交前调用 await verifyTurnstile(formElement)，通过返回 true，失败返回 false

(function() {
  'use strict';

  // Turnstile 站点密钥（在 Cloudflare Dashboard → Turnstile 中获取）
  // 测试用密钥（总是通过）：1x00000000000000000000AA
  const TURNSTILE_SITE_KEY = window.TURNSTILE_SITE_KEY || '0x4AAAAAAEbzQQ7HcgSD19SP';

  // 后端验证接口地址
  const TURNSTILE_VERIFY_URL = window.TURNSTILE_VERIFY_URL || 'https://admin.dka1pha.cc/api/turnstile/verify';

  // 等待 Turnstile 脚本加载完成
  function waitForTurnstile(timeoutMs) {
    timeoutMs = timeoutMs || 10000;
    return new Promise((resolve, reject) => {
      const start = Date.now();
      function check() {
        if (window.turnstile) {
          resolve(window.turnstile);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          reject(new Error('Turnstile 加载超时'));
          return;
        }
        setTimeout(check, 100);
      }
      check();
    });
  }

  // 验证 Turnstile
  // formEl: 包含 .cf-turnstile 的表单元素
  // 返回 Promise<boolean>：验证通过返回 true，失败返回 false
  async function verifyTurnstile(formEl) {
    // 如果没配置站点密钥，跳过验证（方便开发）
    if (!TURNSTILE_SITE_KEY) {
      console.warn('[Turnstile] 未配置站点密钥，跳过验证');
      return true;
    }

    const widget = formEl.querySelector('.cf-turnstile');
    if (!widget) {
      console.warn('[Turnstile] 未找到 Turnstile 组件，跳过验证');
      return true;
    }

    try {
      const ts = await waitForTurnstile(8000);

      // 获取 token（如果已经有了就直接用，没有就触发验证）
      let token = ts.getResponse(widget.dataset.widgetId);
      if (!token) {
        // 执行一次验证（managed 模式下用户无感）
        token = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Turnstile 验证超时')), 15000);
          ts.execute(widget.dataset.widgetId).then(t => {
            clearTimeout(timeout);
            resolve(t);
          }).catch(err => {
            clearTimeout(timeout);
            reject(err);
          });
        });
      }

      if (!token) {
        alert('人机验证失败，请重试。');
        return false;
      }

      // 调用后端验证接口
      const response = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.success) {
        // 验证通过，重置 widget 以便下次使用
        try { ts.reset(widget.dataset.widgetId); } catch (e) {}
        return true;
      } else {
        // 验证失败，重置 widget
        try { ts.reset(widget.dataset.widgetId); } catch (e) {}
        alert('人机验证未通过，请重试。');
        return false;
      }
    } catch (err) {
      console.error('[Turnstile] 验证出错:', err);
      alert('人机验证出错：' + (err.message || '未知错误') + '，请重试。');
      return false;
    }
  }

  // 页面加载完成后，初始化所有 Turnstile widget
  // 由于 turnstile API 是异步加载的，需要处理时机问题
  function initTurnstileWidgets() {
    if (!TURNSTILE_SITE_KEY) return;

    const widgets = document.querySelectorAll('.cf-turnstile');
    widgets.forEach(widget => {
      // 设置 sitekey
      if (!widget.dataset.sitekey) {
        widget.dataset.sitekey = TURNSTILE_SITE_KEY;
      }

      // 如果 turnstile 已经加载，立即渲染
      if (window.turnstile) {
        renderWidget(widget);
      } else {
        // 否则等 turnstile 加载后自动渲染（turnstile 脚本会自动查找 .cf-turnstile）
        // 我们设置一个回调来获取 widgetId
        widget.dataset.onload = 'onTurnstileLoaded';
      }
    });
  }

  function renderWidget(widget) {
    try {
      const widgetId = window.turnstile.render(widget, {
        sitekey: widget.dataset.sitekey || TURNSTILE_SITE_KEY,
        theme: 'auto',
        size: 'normal'
      });
      widget.dataset.widgetId = widgetId;
    } catch (e) {
      console.warn('[Turnstile] 渲染失败:', e);
    }
  }

  // 暴露全局函数
  window.verifyTurnstile = verifyTurnstile;
  window.initTurnstileWidgets = initTurnstileWidgets;
  window.TURNSTILE_SITE_KEY = TURNSTILE_SITE_KEY;

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTurnstileWidgets);
  } else {
    initTurnstileWidgets();
  }
})();
