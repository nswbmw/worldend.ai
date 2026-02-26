const sidebar = `
  <aside class="sidebar">
    <div class="sidebar-widget fade-in">
      <div class="sidebar-title" x-text="t('stats')"></div>
      <div class="stats-grid">
        <div class="stat-cell">
          <div class="stat-value" x-text="stats.prophecyCount">—</div>
          <div class="stat-label" x-text="t('prophecyCount')"></div>
        </div>
        <div class="stat-cell">
          <div class="stat-value" x-text="stats.tagCount">—</div>
          <div class="stat-label" x-text="t('tagCount')"></div>
        </div>
        <div class="stat-cell">
          <div class="stat-value" x-text="stats.modelCount">—</div>
          <div class="stat-label" x-text="t('modelCount')"></div>
        </div>
        <div class="stat-cell">
          <div class="stat-value" x-text="stats.dateCount">—</div>
          <div class="stat-label" x-text="t('dateCount')"></div>
        </div>
      </div>
    </div>
    <div class="sidebar-widget fade-in" style="animation-delay:0.07s;">
      <div class="sidebar-title" x-text="t('models')"></div>
      <div class="models-wrap">
        <template x-for="m in models">
          <a :href="'/' + currentLang + '?modelId=' + m" class="tag tag-clickable" x-text="m"></a>
        </template>
      </div>
    </div>
    <div class="sidebar-widget fade-in" style="animation-delay:0.13s;">
      <div class="sidebar-title" x-text="t('prophecyRanking')"></div>
      <div class="ranking-list">
        <template x-for="(u, i) in prophecyRanking">
          <a :href="'/' + currentLang + '?tag=' + encodeURIComponent(u.name)" class="ranking-item tag-clickable decoration-none">
            <div class="ranking-badge" x-text="i+1"></div>
            <div class="ranking-info">
              <div class="ranking-name" x-text="u.name"></div>
              <div class="ranking-count" x-text="u.count + ' ' + t('prophecies')"></div>
            </div>
            <div class="ranking-percent" x-text="u.percent + '%'"></div>
          </a>
        </template>
      </div>
    </div>
    <div class="sidebar-widget fade-in" style="animation-delay:0.18s;">
      <div class="action-btn-group">
        <a :href="'/' + currentLang + '?type=rss'" class="api-btn rss-btn" title="RSS Feed">
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="6.5" cy="17.5" r="2.5"/>
            <path d="M4 4a16 16 0 0116 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M4 10a10 10 0 0110 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          RSS
        </a>
        <button class="api-btn" @click="showApiModal=true">
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          API
        </button>
      </div>
    </div>
  </aside>`

export default sidebar
