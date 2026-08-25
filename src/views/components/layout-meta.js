import config from '#lib/config.js'

const layoutMeta = `
  <link rel="canonical" href="{{head.canonical}}" />
  {{#head.robots}}<meta name="robots" content="{{.}}" />{{/head.robots}}
  <meta name="description" content="{{head.description}}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${config.brandName}" />
  <meta property="og:image" content="${config.webHost}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${config.brandName}" />
  <meta property="og:title" content="{{head.title}}" />
  <meta property="og:description" content="{{head.description}}" />
  <meta property="og:url" content="{{head.canonical}}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${config.webHost}/og.png" />
  <meta name="twitter:title" content="{{head.title}}" />
  <meta name="twitter:description" content="{{head.description}}" />
  <script type="application/ld+json">{{{head.jsonLd}}}</script>
`
export default layoutMeta
