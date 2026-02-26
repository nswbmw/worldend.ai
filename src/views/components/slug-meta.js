const slugMeta = `
  <link rel="canonical" href="{{head.canonical}}" />
  <meta name="description" content="{{head.description}}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WorldEnd.ai" />
  <meta property="og:title" content="{{head.title}}" />
  <meta property="og:description" content="{{head.description}}" />
  <meta property="og:url" content="{{head.canonical}}" />
  <meta property="og:image" content="{{head.ogImage}}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@worldendai" />
  <meta name="twitter:title" content="{{head.title}}" />
  <meta name="twitter:description" content="{{head.description}}" />
  <meta name="twitter:image" content="{{head.ogImage}}" />
  <meta name="twitter:label1" content="Model" />
  <meta name="twitter:data1" content="{{prophecy.modelId}}" />
  <meta name="twitter:label2" content="Date" />
  <meta name="twitter:data2" content="{{prophecy.date}}" />
  <script type="application/ld+json">{{head.jsonLd}}</script>
`
export default slugMeta
