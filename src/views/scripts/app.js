const appScript = `
  function App() {
    const init = window.__INIT__ || {};
    return {
      loading: false,
      loadingMore: false,
      prophecies: init.prophecies || [],
      searchQuery: init.keyword || '',
      showApiModal: false,
      darkMode: true,
      currentLang: init.lang || 'en',
      langs: [
        {code:'en',    flag:'🇺🇸', label:'English'},
        {code:'zh-CN', flag:'🇨🇳', label:'中文'},
        {code:'ja',    flag:'🇯🇵', label:'日本語'},
        {code:'ko',    flag:'🇰🇷', label:'한국어'},
        {code:'pt',    flag:'🇧🇷', label:'Português'},
        {code:'es',    flag:'🇪🇸', label:'Español'},
        {code:'fr',    flag:'🇫🇷', label:'Français'},
      ],
      stats: init.stats || {prophecyCount:'—', modelCount:'—', dateCount:'—', tagCount:'—'},
      models: init.models || [],
      prophecyRanking: init.prophecyRanking || [],
      page: init.page || 1,
      pageSize: init.pageSize || 10,
      hasMore: init.hasMore !== false,
      modelId: init.modelId || null,
      tag: init.tag || null,
      keyword: init.keyword || null,

      t(key) { return (I18N[this.currentLang] || I18N['en'])[key] || key; },

      submitSearch() {
        const q = this.searchQuery.trim();
        const params = new URLSearchParams();
        if (q) params.set('keyword', q);
        window.location.href = '/' + this.currentLang + (params.toString() ? '?' + params.toString() : '');
      },
      applyTheme(isDark) {
        const root = document.documentElement;
        root.classList.toggle('light', !isDark);
        root.style.colorScheme = isDark ? 'dark':'light';
      },
      async init() {
        try {
          const darkMode = localStorage.getItem('wd_darkMode');
          if (darkMode !== null) this.darkMode = darkMode === 'true';
        } catch(e) {}
        this.applyTheme(this.darkMode);
      },

      toggleDark() {
        this.darkMode = !this.darkMode;
        this.applyTheme(this.darkMode);
        try { localStorage.setItem('wd_darkMode', this.darkMode); } catch(e) {}
      },

      setLang(code) {
        const parts = window.location.pathname.split('/');
        parts[1] = code;
        window.location.href = parts.join('/') + window.location.search;
      },

      async shareProphecy(prophecy, localData) {
        const url = prophecy.url;
        const title = prophecy.tag || prophecy.slug;
        if (navigator.share) {
          try { await navigator.share({ title, url }); } catch(e) {}
        } else {
          try {
            await navigator.clipboard.writeText(url);
          } catch(e) {
            const ta = document.createElement('textarea');
            ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
          }
          localData.copied = true;
          setTimeout(() => { localData.copied = false; }, 1800);
        }
      },

      shareToX(prophecy) {
        const xUrl = 'https://x.com/intent/post?url=' + encodeURIComponent(prophecy.url);
        window.open(xUrl, '_blank');
      },

      async loadMore() {
        if (this.loadingMore || !this.hasMore) return;
        this.loadingMore = true;
        try {
          const params = new URLSearchParams({ type: 'json', page: this.page + 1, pageSize: this.pageSize });
          if (this.modelId) params.set('modelId', this.modelId);
          if (this.tag) params.set('tag', this.tag);
          if (this.keyword) params.set('keyword', this.keyword);
          const res = await fetch('/' + this.currentLang + '?' + params.toString());
          const data = await res.json();
          if (data && data.length) {
            this.prophecies = [...this.prophecies, ...data];
            this.page++;
            this.hasMore = data.length === this.pageSize;
          } else {
            this.hasMore = false;
          }
        } catch(e) {}
        this.loadingMore = false;
      },
    };
  }`

export default appScript
