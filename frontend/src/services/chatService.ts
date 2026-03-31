import { Message, AgentProfile, LLMProvider } from '../types';
import { createOpenAIAdapter } from '../llm/openai';
import { buildSystemPrompt } from '../agent/parser';

export async function sendMessageReal(
  _sessionId: string,
  content: string,
  agent: AgentProfile,
  provider: LLMProvider,
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<string> {
  if (!provider.apiKey) {
    throw new Error('API Key未设置，请在设置中配置');
  }

  const adapter = createOpenAIAdapter({
    baseUrl: provider.baseUrl || 'https://api.openai.com/v1',
    apiKey: provider.apiKey,
    defaultModel: provider.config.defaultModel || 'gpt-4o-mini',
    maxTokens: provider.config.maxTokens,
    temperature: provider.config.temperature,
  });

  const systemPrompt = buildSystemPrompt(agent);
  
  return await adapter.chatStream(
    {
      systemPrompt,
      history,
      userMessage: content,
    },
    onChunk
  );
}
