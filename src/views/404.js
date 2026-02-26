const notFound = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 — WorldEnd.ai</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles/404.css" />
  {{> googleAnalysis}}
</head>
<body>
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="logo-mark">WorldEnd.ai</a>
    </div>
  </nav>
  <main class="page">
    <div class="content">
      <div class="error-code">404</div>
      <div style="margin-bottom:14px;">
        <span class="tag">PAGE_NOT_FOUND</span>
      </div>
      <h1 class="title">This prophecy <em>does not exist</em></h1>
      <p class="desc">The page you're looking for has either been lost to the void,<br>or never existed in the first place — much like our future.</p>
    </div>
  </main>
</body>
</html>`

export default notFound
