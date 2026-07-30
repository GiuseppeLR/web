(function() {
  'use strict';

  const searchBox = document.getElementById('search-box');
  const resultsContainer = document.getElementById('search-results');

  if (!searchBox || !resultsContainer) return;

  // Search index
  const posts = [
    {
      title: 'NJTech Timetable',
      titleZh: '\u5357\u5DE5\u8BFE\u7A0B\u8868',
      date: 'Jul 29, 2026',
      tags: ['Flutter', 'Mobile'],
      url: '/web/blog/njtech-timetable/',
      urlZh: '/web/zh-cn/blog/njtech-timetable/',
      excerpt: 'A course schedule management tool for Nanjing Tech University students built with Flutter.',
      excerptZh: '\u4E00\u6B3E\u9762\u5411\u5357\u4EAC\u5DE5\u4E1A\u5927\u5B66\u5B66\u751F\u7684\u8BFE\u7A0B\u8868\u7BA1\u7406\u5DE5\u5177\uFF0C\u4F7F\u7528 Flutter \u6784\u5EFA\u3002'
    }
  ];

  function renderResults(query, lang) {
    const q = query.toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML =
        '<div class="search-empty">' +
        (lang === 'zh' ? '\u8F93\u5165\u5173\u952E\u8BCD\u641C\u7D22\u535A\u5BA2\u6587\u7AE0...' : 'Type to search blog posts...') +
        '</div>';
      return;
    }

    const matched = posts.filter(p => {
      const title = lang === 'zh' ? p.titleZh.toLowerCase() : p.title.toLowerCase();
      const excerpt = lang === 'zh' ? p.excerptZh.toLowerCase() : p.excerpt.toLowerCase();
      const tags = p.tags.join(' ').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || tags.includes(q);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML =
        '<div class="search-empty">' +
        (lang === 'zh' ? '\u6CA1\u6709\u627E\u5230\u76F8\u5173\u6587\u7AE0' : 'No results found') +
        '</div>';
      return;
    }

    resultsContainer.innerHTML = matched.map(p => {
      const url = lang === 'zh' ? p.urlZh : p.url;
      const title = lang === 'zh' ? p.titleZh : p.title;
      const excerpt = lang === 'zh' ? p.excerptZh : p.excerpt;
      return `<a href="${url}" class="search-result-item">
        <h3>${title}</h3>
        <div class="meta">${p.date} \u00B7 ${p.tags.map(t => `<span class="tag">${t}</span>`).join(' ')}</div>
        <p>${excerpt}</p>
      </a>`;
    }).join('');
  }

  // Detect language
  const lang = window.location.pathname.startsWith('/zh-cn') ? 'zh' : 'en';

  searchBox.addEventListener('input', () => {
    renderResults(searchBox.value, lang);
  });

  // Initial render
  renderResults('', lang);
})();
