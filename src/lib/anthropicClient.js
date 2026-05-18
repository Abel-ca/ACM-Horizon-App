import Anthropic from '@anthropic-ai/sdk'

export async function callAgent({ apiKey, systemPrompt, messages, onChunk, onComplete, onError }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    let fullText = ''

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta' &&
        event.delta.text
      ) {
        fullText += event.delta.text
        onChunk?.(event.delta.text, fullText)
      }
    }

    onComplete?.(fullText)
    return fullText
  } catch (error) {
    onError?.(error)
    throw error
  }
}
