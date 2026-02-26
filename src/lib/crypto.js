async function createHash ({ algorithm, text }) {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(text)

  const digest = await crypto.subtle.digest({ name: algorithm }, buffer)
  const hash = Array.from(new Uint8Array(digest))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')

  return hash
}

export function sha1 (text) {
  return createHash({ algorithm: 'SHA-1', text })
}
