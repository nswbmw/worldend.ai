const nav = `
  <nav class="nav">
    <div class="nav-inner">
      <div class="logo-wrap">
        <a :href="'/' + currentLang" class='decoration-none'><span class="logo-mark">WorldEnd.ai</span></a>
      </div>
      <div class="nav-spacer"></div>
      <div class="search-wrap">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input class="search-input" x-model="searchQuery" @keydown.enter="submitSearch()" placeholder="Search prophecies..." type="text" />
      </div>
      <button class="nav-icon-btn" @click="toggleDark()" title="Toggle theme">
        <svg x-show="darkMode" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        <svg x-show="!darkMode" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      </button>
      <div class="lang-wrap" x-data="{langOpen:false}">
        <button class="lang-trigger" @click="langOpen=!langOpen" title="Language">
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
          <span class="lang-trigger-code" x-text="currentLang === 'zh-CN' ? 'ZH' : currentLang.toUpperCase()"></span>
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            class="lang-chevron" :class="langOpen ? 'lang-chevron-open' : ''">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div 
          class="lang-panel"
          x-show="langOpen"
          @click.outside="langOpen=false"
          x-transition:enter="transition ease-out duration-120"
          x-transition:enter-start="opacity-0 translate-y-1 scale-95"
          x-transition:enter-end="opacity-100 translate-y-0 scale-100"
          x-transition:leave="transition ease-in duration-90"
          x-transition:leave-start="opacity-100"
          x-transition:leave-end="opacity-0"
          style="display:none;"
        >
          <template x-for="l in langs" :key="l.code">
            <button
              class="lang-item"
              :class="currentLang === l.code ? 'lang-active' : ''"
              @click="setLang(l.code); langOpen=false">
              <span class="lang-flag" x-text="l.flag"></span>
              <span class="lang-label" x-text="l.label"></span>
              <svg x-show="currentLang === l.code" class="lang-check" width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>`

export default nav
