import Anthropic from '@anthropic-ai/sdk'

/**
 * Web Search tool — server-side, Anthropic executes it automatically.
 * The model calls it when needed; no client-side tool loop required.
 */
const WEB_SEARCH_TOOL = {
  type: 'web_search_20250305',
  name: 'web_search',
}

/**
 * callAgent — streams a response from Claude with web search enabled.
 *
 * Callbacks:
 *   onChunk(delta, accumulated)  — called for each text chunk received
 *   onWebSearch(query)           — called when the model initiates a web search (optional)
 *   onComplete(fullText)         — called once streaming finishes
 *   onError(error)               — called on any API error
 */
export async function callAgent({
  apiKey,
  systemPrompt,
  messages,
  onChunk,
  onWebSearch,
  onComplete,
  onError,
}) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  try {
    // Use the beta namespace to send the web-search-2025-03-05 header.
    // Anthropic executes web searches server-side — no client tool loop needed.
    const stream = client.beta.messages.stream({
      model:      'claude-sonnet-4-6',
      max_tokens: 8192,
      system:     systemPrompt,
      messages,
      tools:      [WEB_SEARCH_TOOL],
      betas:      ['web-search-2025-03-05'],
    })

    let fullText = ''

    for await (const event of stream) {
      // Text streaming — collect and forward each delta
      if (
        event.type === 'content_block_delta' &&
        event.delta?.type === 'text_delta' &&
        event.delta.text
      ) {
        fullText += event.delta.text
        onChunk?.(event.delta.text, fullText)
      }

      // Web search starting — notify UI so it can show a "Searching…" indicator
      if (
        event.type === 'content_block_start' &&
        event.content_block?.type === 'tool_use' &&
        event.content_block?.name === 'web_search'
      ) {
        onWebSearch?.(event.content_block?.input?.query ?? '')
      }
    }

    onComplete?.(fullText)
    return fullText
  } catch (error) {
    onError?.(error)
    throw error
  }
}
