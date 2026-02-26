const apiModal = `
  <div 
    class="modal-backdrop"
    x-show="showApiModal"
    x-transition 
    style="display:none;"
    @click.self="showApiModal=false"
  >
    <div class="modal" @click.stop>
      <button class="modal-close" @click="showApiModal=false">
        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="modal-header">
        <div class="modal-icon">
          <svg width="15" height="15" fill="none" stroke="var(--orange)" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <div class="modal-title">WorldEnd.ai API</div>
          <div class="modal-subtitle">Access prophecies from all AI models</div>
        </div>
      </div>
      <div class="modal-body">
        <div class="api-block">
          <div class="api-block-label">GET PROPHECIES</div>
          <div class="api-block-url">GET https://worldend.ai/$\{lang\}?type=json&date=$\{date\}&modelId=$\{modelId\}&tag=$\{tag\}&page=$\{page\}&pageSize=$\{pageSize\}</div>
        </div>
        <div class="api-block">
          <div class="api-block-label">SEARCH PROPHECIES</div>
          <div class="api-block-url">GET https://worldend.ai/$\{lang\}?type=json&keyword=$\{keyword\}&page=$\{page\}&pageSize=$\{pageSize\}</div>
        </div>
        <div class="api-block">
          <div class="api-block-label">GET PROPHECY DETAIL</div>
          <div class="api-block-url">GET https://worldend.ai/$\{lang\}/$\{slug\}?type=json</div>
        </div>
        <div class="api-block">
          <div class="api-block-label">$lang</div>
          <div class="api-block-tags">
            <template x-for="l in langs">
              <span class="api-model-tag" x-text="l.code"></span>
            </template>
          </div>
        </div>
        <div class="api-block">
          <div class="api-block-label">$date</div>
          <div class="api-block-tags">
            <span class="api-model-tag">YYYY-MM-DD</span>
          </div>
        </div>
        <div class="api-block">
          <div class="api-block-label">$modelId</div>
          <div class="api-block-tags">
            <template x-for="m in models">
              <span class="api-model-tag" x-text="m"></span>
            </template>
          </div>
        </div>
        <div class="api-block">
          <div class="api-block-label">$tag</div>
          <div class="api-block-tags">
            <span class="api-model-tag">Climate Catastrophe</span>
            <span class="api-model-tag">Climate Collapse</span>
            <span class="api-model-tag">...</span>
          </div>
        </div>
      </div>
    </div>
  </div>`

export default apiModal
