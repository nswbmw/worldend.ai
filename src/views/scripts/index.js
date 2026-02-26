import i18n from './i18n.js'
import appScript from './app.js'

const scripts = `
  <script>
    window.__INIT__ = {{{initJson}}};
  </script>
  <script>
  ${i18n}
  ${appScript}
  </script>`

export default scripts
