import layout from '#views/layout.js'
import nav from '#views/components/nav.js'
import sidebar from '#views/components/sidebar.js'
import apiModal from '#views/components/api-modal.js'
import scrollTop from '#views/components/scroll-top.js'
import footer from '#views/components/footer.js'
import googleAnalysis from '#views/components/google-analysis.js'
import { prophecyCard } from '#views/components/prophecy.js'
import scripts from '#views/scripts/index.js'
import notFoundTemplate from '#views/404.js'

const basePartials = {
  nav,
  sidebar,
  apiModal,
  scrollTop,
  footer,
  googleAnalysis,
  prophecyCard,
  scripts,
}

export function renderLayout (ctx, data, additionalPartials = {}) {
  const dataWithYear = {
    ...data,
    currentYear: new Date().getFullYear()
  }
  return ctx.render(layout, dataWithYear, { ...basePartials, ...additionalPartials })
}

export function renderNotFound (ctx) {
  return ctx.render(notFoundTemplate, {}, { googleAnalysis })
}
