// LLM 适配器导出入口

export type { LLMAdapter, ChatMessage, ChatRequestParams, StreamCallback, LLMAdapterConfig } from './adapter';
export { OpenAICompatibleAdapter, createOpenAIAdapter } from './openai';
export type { OpenAIConfig } from './openai';

// 导入类型用于工厂函数
import type { LLMAdapter } from './adapter';
import { OpenAICompatibleAdapter, type OpenAIConfig } from './openai';

/**
 * 创建 LLM 适配器的工厂函数
 * 根据配置类型创建对应的适配器
 */
export function createLLMAdapter(
  type: 'openai_compatible',
  config: OpenAIConfig
): LLMAdapter {
  switch (type) {
    case 'openai_compatible':
      return new OpenAICompatibleAdapter(config);
    default:
      throw new Error(`Unsupported LLM adapter type: ${type}`);
  }
}