import CloudflareKVCache from 'cloudflare-kv-cache'

const cache = CloudflareKVCache({
  binding: 'KV',
  prefix: 'cache:',
  ttl: 86400, // 1d
  key (obj) {
    return [this.name, ...Object.keys(obj || {}).sort().map(key => obj[key] || '')].join(':')
  }
})

export default cache
