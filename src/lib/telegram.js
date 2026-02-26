import config from '#lib/config.js'

export async function sendNotification (text) {
  const res = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: config.telegram.chatId,
      text: `[${config.name}]: ${text}`
    })
  })

  return res.json()
}
