(function() {
  'use strict';

  const searchBox = document.getElementById('search-box');
  const resultsContainer = document.getElementById('search-results');
  const clearBtn = document.getElementById('search-clear');

  if (!searchBox || !resultsContainer) return;

  const lang = window.location.pathname.startsWith('/zh-cn') ? 'zh' : 'en';

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
    },
    {
      title: 'PDF Reader for macOS',
      titleZh: 'PDF Reader for macOS',
      date: 'Jul 29, 2026',
      tags: ['Swift', 'macOS', 'SwiftUI'],
      url: '/web/blog/pdfreader/',
      urlZh: '/web/zh-cn/blog/pdfreader/',
      excerpt: 'A feature-rich native macOS PDF reader built with SwiftUI & PDFKit.',
      excerptZh: '\u4E00\u4E2A\u529F\u80FD\u4E30\u5BCC\u7684 macOS \u539F\u751F PDF \u9605\u8BFB\u5668\uFF0C\u4F7F\u7528 SwiftUI + PDFKit \u6784\u5EFA\u3002'
    }
  ];

  function getEmptyState() {
    const icon = `
      <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>`;
    if (lang === 'zh') {
      return icon +
        '<div class="search-empty-text">\u8F93\u5165\u5173\u952E\u8BCD\u641C\u7D22\u535A\u5BA2\u6587\u7AE0</div>' +
        '<div class="search-empty-hint">\u53EF\u4EE5\u641C\u7D22\u6587\u7AE0\u6807\u9898\u3001\u6458\u8981\u548C\u6807\u7B7E</div>';
    }
    return icon +
      '<div class="search-empty-text">Type to search blog posts</div>' +
      '<div class="search-empty-hint">Search by title, excerpt, or tags</div>';
  }

  function getNoResultsState() {
    const icon = `
      <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>`;
    if (lang === 'zh') {
      return icon +
        '<div class="search-empty-text">\u6CA1\u6709\u627E\u5230\u76F8\u5173\u6587\u7AE0</div>' +
        '<div class="search-empty-hint">\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD</div>';
    }
    return icon +
      '<div class="search-empty-text">No results found</div>' +
      '<div class="search-empty-hint">Try different keywords</div>';
  }

  function renderResults(query) {
    const q = query.toLowerCase().trim();

    if (!q) {
      resultsContainer.innerHTML = '<div class="search-empty">' + getEmptyState() + '</div>';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';

    const matched = posts.filter(p => {
      const title = lang === 'zh' ? p.titleZh.toLowerCase() : p.title.toLowerCase();
      const excerpt = lang === 'zh' ? p.excerptZh.toLowerCase() : p.excerpt.toLowerCase();
      const tags = p.tags.join(' ').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || tags.includes(q);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = '<div class="search-empty">' + getNoResultsState() + '</div>';
      return;
    }

    resultsContainer.innerHTML = matched.map(p => {
      const url = lang === 'zh' ? p.urlZh : p.url;
      const title = lang === 'zh' ? p.titleZh : p.title;
      const excerpt = lang === 'zh' ? p.excerptZh : p.excerpt;
      return '<a href="' + url + '" class="search-result-item">' +
        '<h3>' + title + '</h3>' +
        '<div class="meta">' + p.date + ' \u00B7 ' +
          p.tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join(' ') +
        '</div>' +
        '<p>' + excerpt + '</p>' +
      '</a>';
    }).join('');
  }

  searchBox.addEventListener('input', function() {
    renderResults(this.value);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchBox.value = '';
      searchBox.focus();
      renderResults('');
    });
  }

  // Initial render
  renderResults('');
})();
