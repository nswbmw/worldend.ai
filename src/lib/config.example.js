import dayjs from 'dayjs'

const langs = [
  'en',
  'zh-CN',
  'ja',
  'ko',
  'pt',
  'es',
  'fr'
]

const models = [
  {
    id: 'claude-opus-4.6',
    platform: 'Anthropic'
  },
  {
    id: 'gpt-5.2',
    platform: 'OpenAI'
  },
  {
    id: 'gemini-3.1-pro',
    platform: 'Google'
  },
  {
    id: 'grok-4',
    platform: 'xAI'
  },
  {
    id: 'llama-4-maverick-t',
    platform: 'Meta'
  },
  {
    id: 'deepseek-r1',
    platform: 'DeepSeek'
  },
  {
    id: 'qwen3.5-plus',
    platform: 'Qwen'
  },
  {
    id: 'glm-5',
    platform: 'GLM'
  },
  {
    id: 'minimax-m2.5',
    platform: 'MiniMax'
  },
  {
    id: 'kimi-k2.5',
    platform: 'Kimi'
  },
]
const modelIds = models.map(model => model.id)

const config = {
  name: 'worldend',
  brandName: 'WorldEnd',
  domain: 'worldend.ai',
  email: 'admin@worldend.ai',
  webHost: 'https://worldend.ai',
  apiHost: 'https://api.worldend.ai',
  langs,
  models,
  modelIds,

  get prompt () {
    return `Today is ${dayjs().format('YYYY-MM-DD')}.

Based on current global trends (technology, environment, geopolitics, and society), predict the single most likely way the world could end.

Requirements:
1. Choose only ONE most probable cause.
2. Respond in English only.
3. The response must be under 2000 characters.
4. First, provide a concise keyword or short phrase that summarizes this prediction (e.g., "Climate Collapse").
5. Then, provide a clear and concise explanation. The explanation may contain multiple paragraphs if helpful, but should remain focused and not verbose.

Additional constraints:
- Do NOT ask any questions.
- Do NOT offer to continue, expand, or provide next steps.
- Do NOT include meta-commentary or conversational prompts.
- Output the final answer only.

Output format:
Keyword: <one short phrase>
Explanation:
<one or more concise paragraphs>`
  },

  telegram: {
    token: 'xxx',
    chatId: 'xxx'
  },

  poe: {
    url: 'https://api.poe.com',
    apiKey: 'xxx'
  },

  google: {
    key: 'xxx',
    translateTTL: 86400 * 180
  },

  r2: {
    url: 'https://xxx.r2.cloudflarestorage.com/worldend',
    accessKeyId: 'xxx',
    secretAccessKey: 'xxx'
  }
}

export default config
