import generateDayProphecies from '#scheduled/generateDayProphecies.js'
import { sendNotification } from '#lib/telegram.js'

export default {
  async scheduled (event, env, ctx) {
    try {
      await generateDayProphecies(event, env, ctx)
    } catch (e) {
      await sendNotification(`scheduled error: ${e.message}, cause: ${e.cause}`)
    }
  }
}
