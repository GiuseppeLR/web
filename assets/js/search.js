(function() {
  'use strict';

  const searchBox = document.getElementById('search-box');
  const resultsContainer = document.getElementById('search-results');
  const clearBtn = document.getElementById('search-clear');

  if (!searchBox || !resultsContainer) return;

  const lang = window.location.pathname.startsWith('/zh-cn') ? 'zh' : 'en';

  // Static fallback posts (used if Supabase fails)
  const staticPosts = [
    {
      title: 'NJTech Timetable',
      titleZh: '南工课程表',
      date: 'Jul 29, 2026',
      tags: ['Flutter', 'Mobile'],
      url: '/blog/njtech-timetable/',
      urlZh: '/zh-cn/blog/njtech-timetable/',
      excerpt: 'A course schedule management tool for Nanjing Tech University students built with Flutter.',
      excerptZh: '一款面向南京工业大学学生的课程表管理工具，使用 Flutter 构建。'
    },
    {
      title: 'PDF Reader for macOS',
      titleZh: 'PDF Reader for macOS',
      date: 'Jul 29, 2026',
      tags: ['Swift', 'macOS', 'SwiftUI'],
      url: '/blog/pdfreader/',
      urlZh: '/zh-cn/blog/pdfreader/',
      excerpt: 'A feature-rich native macOS PDF reader built with SwiftUI & PDFKit.',
      excerptZh: '一个功能丰富的 macOS 原生 PDF 阅读器，使用 SwiftUI + PDFKit 构建。'
    }
  ];

  let posts = staticPosts;
  let loaded = false;

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (lang === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  async function loadPosts() {
    if (!window.supabaseClient) {
      loaded = true;
      renderResults(searchBox.value);
      return;
    }

    try {
      var dbLang = lang === 'zh' ? 'zh' : 'en';
      var { data, error } = await window.supabaseClient
        .from('blog_posts')
        .select('id, title, slug, excerpt, tags, published_at, created_at')
        .eq('published', true)
        .eq('lang', dbLang)
        .order('published_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        posts = data.map(function(p) {
          var baseUrl = lang === 'zh' ? '/zh-cn/blog/post.html' : '/blog/post.html';
          var url = baseUrl + '?slug=' + encodeURIComponent(p.slug);
          var dateStr = formatDate(p.published_at || p.created_at);
          return {
            title: p.title,
            titleZh: p.title,
            date: dateStr,
            tags: p.tags || [],
            url: url,
            urlZh: url,
            excerpt: p.excerpt || '',
            excerptZh: p.excerpt || ''
          };
        });
      }
    } catch (err) {
      console.error('Search: failed to load posts from Supabase, using static fallback', err);
    }

    loaded = true;
    renderResults(searchBox.value);
  }

  function getEmptyState() {
    var icon = '<svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    if (lang === 'zh') {
      return icon + '<div class="search-empty-text">输入关键词搜索博客文章</div><div class="search-empty-hint">可以搜索文章标题、摘要和标签</div>';
    }
    return icon + '<div class="search-empty-text">Type to search blog posts</div><div class="search-empty-hint">Search by title, excerpt, or tags</div>';
  }

  function getNoResultsState() {
    var icon = '<svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';
    if (lang === 'zh') {
      return icon + '<div class="search-empty-text">没有找到相关文章</div><div class="search-empty-hint">请尝试其他关键词</div>';
    }
    return icon + '<div class="search-empty-text">No results found</div><div class="search-empty-hint">Try different keywords</div>';
  }

  function getLoadingState() {
    if (lang === 'zh') {
      return '<div class="search-loading"><div class="spinner"></div><p>正在加载文章...</p></div>';
    }
    return '<div class="search-loading"><div class="spinner"></div><p>Loading posts...</p></div>';
  }

  function renderResults(query) {
    var q = query.toLowerCase().trim();

    if (!loaded) {
      resultsContainer.innerHTML = '<div class="search-empty">' + getLoadingState() + '</div>';
      return;
    }

    if (!q) {
      resultsContainer.innerHTML = '<div class="search-empty">' + getEmptyState() + '</div>';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';

    var matched = posts.filter(function(p) {
      var title = (lang === 'zh' ? p.titleZh : p.title).toLowerCase();
      var excerpt = (lang === 'zh' ? p.excerptZh : p.excerpt).toLowerCase();
      var tags = p.tags.join(' ').toLowerCase();
      return title.includes(q) || excerpt.includes(q) || tags.includes(q);
    });

    if (matched.length === 0) {
      resultsContainer.innerHTML = '<div class="search-empty">' + getNoResultsState() + '</div>';
      return;
    }

    resultsContainer.innerHTML = matched.map(function(p) {
      var url = lang === 'zh' ? p.urlZh : p.url;
      var title = lang === 'zh' ? p.titleZh : p.title;
      var excerpt = lang === 'zh' ? p.excerptZh : p.excerpt;
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

  // Initial render (shows loading, then loads from Supabase)
  renderResults('');
  loadPosts();
})();
