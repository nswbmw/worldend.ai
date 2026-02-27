const layout = `<!DOCTYPE html>
<html lang="{{lang}}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="color-scheme" content="dark light">
  <script>
    (function(){
      try {
        const theme = localStorage.getItem('wd_darkMode');
        let effectiveTheme;
        if (theme === null) {
          effectiveTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
          effectiveTheme = theme === 'true';
        }
        const root = document.documentElement;
        root.classList.toggle('light', !effectiveTheme);
        root.style.colorScheme = effectiveTheme ? 'dark' : 'light';
      } catch(e) {}
    })()
  </script>
  <title>{{title}}WorldEnd.ai</title>
  {{> headMeta}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.13.3/cdn.min.js" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="/styles/base.css" />
  <link rel="stylesheet" href="/styles/layout.css" />
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  {{> googleAnalysis}}
</head>
<body x-data="App()" x-init="init()">
  {{> nav}}
  <main class="main-layout">
    <div>
      {{> content}}
    </div>
    {{> sidebar}}
  </main>
  {{> apiModal}}
  {{> scrollTop}}
  {{> footer}}
  {{> scripts}}
</body>
</html>`

export default layout
