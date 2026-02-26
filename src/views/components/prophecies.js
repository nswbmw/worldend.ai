const prophecies = `
  <div x-show="loading">
    <div class="skeleton-list">
      <template x-for="i in 10">
        <div class="skeleton-card">
          <div class="skeleton-body">
            <div class="skeleton skeleton-row-sm"></div>
            <div class="skeleton skeleton-row-md"></div>
            <div class="skeleton skeleton-row-base"></div>
            <div class="skeleton skeleton-row-xs"></div>
          </div>
          <div class="skeleton skeleton-avatar"></div>
        </div>
      </template>
    </div>
  </div>
  <div x-show="!loading">
    <div>
      <div class="prophecy-list stagger">
        <template x-for="(prophecy, idx) in prophecies" :key="prophecy.slug">
          <a :href="'/' + currentLang + '/' + prophecy.slug" class="decoration-none">
            {{> prophecyCard}}
          </a>
        </template>
      </div>
      <div class="load-more-wrap">
        <button type="button" class="load-more-btn" @click="loadMore()" x-show="hasMore" :disabled="loadingMore" x-text="loadingMore ? '...' : t('loadMore')"></button>
        <span x-show="!hasMore" class="text-sm text-[--text-muted]">— end —</span>
      </div>
    </div>
  </div>
`

export default prophecies
