export default function route (app) {
  app.get(
    '/favicon.ico',
    async (ctx, next) => {
      ctx.res.type = 'image/svg+xml'
      ctx.res.body = '<svg id="iptm" data-gjs-type="svg" draggable="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-source-file="src/components/common/SafeIcon.vue" data-source-line-start="43" data-source-line-end="49" class="lucide text-foreground lucide-skull-icon lucide-skull gjs-selected"><path id="ivxg" data-gjs-type="svg-in" draggable="true" d="m12.5 17-.5-1-.5 1h1z"></path><path id="ivlvt" data-gjs-type="svg-in" draggable="true" d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"></path><circle id="i8sdk" data-gjs-type="svg-in" draggable="true" cx="15" cy="12" r="1"></circle><circle id="ighkq" data-gjs-type="svg-in" draggable="true" cx="9" cy="12" r="1"></circle></svg>'
    }
  )
}
