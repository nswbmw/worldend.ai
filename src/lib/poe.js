import config from '#lib/config.js'

/*
{
  tag: 'xxx',
  content: 'yyy',
}
*/
export async function getPoeResponse ({ modelId, prompt }) {
  const res = await fetch(`${config.poe.url}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.poe.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  })

  /*
  Success:
  {
    id: 'chatcmpl-f13333d731a50b0f8d18d2af',
    object: 'chat.completion',
    created: 1770213992,
    model: 'claude-opus-4.5',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: 'Keyword: AI-Enabled Nuclear Escalation\n' +
            '\n' +
            'Explanation:\n' +
            '\n' +
            'The most probable world-ending scenario stems from the dangerous intersection of artificial intelligence integration into military command systems and escalating geopolitical tensions between nuclear powers. As of 2026, the accelerating AI arms race has pushed major powers—particularly the United States, China, and Russia—to incorporate autonomous and semi-autonomous systems into their early warning, threat assessment, and strategic response frameworks.\n' +
            '\n' +
            'The core danger lies not in AI "going rogue" but in compressed decision timelines, algorithmic misinterpretation, and human over-reliance on machine recommendations during crisis situations. Hypersonic weapons have already reduced response windows to mere minutes. When AI systems are trusted to evaluate ambiguous sensor data—satellite anomalies, cyberattacks on infrastructure, or conventional military movements—the probability of catastrophic misclassification increases substantially. A false positive interpreted as a first strike, combined with leaders who feel compelled to act on algorithmic recommendations before verification, creates a pathway to unintended nuclear exchange.\n' +
            '\n' +
            'Current geopolitical flashpoints—Taiwan Strait tensions, NATO-Russia friction, India-Pakistan instability, and Middle Eastern conflicts drawing in major powers—provide the kindling. The integration of AI removes the traditional human deliberation buffer that has historically prevented accidents from becoming extinction events. Unlike climate collapse or pandemics, which unfold over years and allow for adaptive responses, nuclear escalation can transition from crisis to civilizational destruction within hours.\n' +
            '\n' +
            'The technology is already deployed. The tensions already exist. The missing element is only the triggering incident.'
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      completion_tokens: 344,
      prompt_tokens: 219,
      total_tokens: 563,
      completion_tokens_details: null,
      prompt_tokens_details: { audio_tokens: null, cached_tokens: 0 }
    }
  }

  Error:
  {
    error: {
      message: 'You've used up your points! Visit https://poe.com/api_key to get more.',
      type: 'insufficient_quota',
      param: null,
      code: 'insufficient_quota'
    }
  }
  */
  const json = await res.json()
  // console.dir(json, { depth: 10 })

  if (json.error) {
    throw new Error(JSON.stringify(json.error))
  }

  const output = json.choices[0].message.content
  const tag = output.match(/^Keyword:\s*(.+)\s*$/m)?.[1]?.trim() ?? ''
  const content = output.match(/^Explanation:\s*([\s\S]*)$/m)?.[1]?.trim() ?? ''

  if (!tag || !content) {
    // for debug
    console.log(`modelId: ${modelId}, output: ${output}`)
  }

  return {
    tag,
    content
  }
}
