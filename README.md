<p align="center">
    <img src="public/logo.jpg" width="200" />
    <h1 align="center"><a href="https://worldend.ai">WorldEnd.ai</a></h1>
    <p align="center">A living archive of AI-generated doomsday prophecies.</p>
    <p align="center">
        English | <a href="README_zh.md">简体中文</a>
    </p>
</p>

## Screenshots

![dark](screenshots/dark.png)

![light](screenshots/light.png)

## Tech Stack

- [Hoa](https://github.com/hoa-js/hoa) - Lightweight web framework
- Cloudflare Workers - Edge computing platform
- Cloudflare KV - Cache
- Cloudflare D1 - Database
- Cloudflare R2 - Storage

## Deploy

1. Reconfiguration `wrangler.jsonc` and `wrangler.scheduled.jsonc`
2. Rename `src/lib/config.example.js` to `src/lib/config.js`
3. Run:

```
npm run dev
# or
npm run deploy
```
