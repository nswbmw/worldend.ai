export const prophecyCard = `
  <div class="prophecy-card relative">
    <div class="prophecy-body">
      <div><span class="tag" x-text="prophecy.modelId"></span></div>
      <h1 class="prophecy-title" x-text="prophecy.tag"></h1>
      <div class="prophecy-content" x-html="prophecy.content"></div>
      <div class="meta-info mt-4 flex flex-wrap items-center justify-between text-sm">
        <span x-text="prophecy.date"></span>
        <div class="share-wrap relative inline-flex items-center gap-2" x-data="{copied:false}">
          <button
            class="share-btn w-[22px] h-[22px] p-0 flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200"
            :class="copied ? 'shared' : ''"
            @click.prevent.stop="shareProphecy(prophecy, $data)"
            title="Share">
            <svg x-show="!copied" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            <svg x-show="copied" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
          <button
            class="share-btn w-[22px] h-[22px] p-0 flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors duration-200"
            @click.prevent.stop="shareToX(prophecy)"
            title="Share to X">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/>
            </svg>
          </button>
          <div class="share-toast" x-show="copied" style="display:none;">Copied!</div>
        </div>
      </div>
    </div>
  </div>
`

const prophecy = `
  <div x-data="ProphecyPage()">
    <a :href="'/' + currentLang" class='mb-4 inline-flex items-center gap-1.5 text-[--text-secondary] decoration-none text-sm'>
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
      </svg>
      Back
    </a>
    {{> prophecyCard}}
  </div>
  <script>
    function ProphecyPage() {
      const init = window.__INIT__ || {};
      return {
        prophecy: init.prophecy || {},
      };
    }
  </script>
`

export default prophecy
