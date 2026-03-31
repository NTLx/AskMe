// OpenAI Compatible 适配器实现
// 支持所有兼容 OpenAI API 格式的服务

import type { LLMAdapter, ChatMessage, ChatRequestParams, StreamCallback, LLMAdapterConfig } from './adapter';

/**
 * OpenAI Compatible 适配器配置
 */
export interface OpenAIConfig extends LLMAdapterConfig {
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
}

/**
 * OpenAI API 请求体
 */
interface OpenAIRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

/**
 * OpenAI API 响应体
 */
interface OpenAIResponse {
  id: string;
  object: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * OpenAI SSE 流式响应数据
 */
interface StreamDelta {
  role?: string;
  content?: string;
}

interface StreamChoice {
  index: number;
  delta: StreamDelta;
  finish_reason?: string;
}

interface StreamResponse {
  id: string;
  object: string;
  choices: StreamChoice[];
}

/**
 * OpenAI Compatible 适配器
 * 支持自定义 baseUrl，兼容各种 OpenAI 兼容 API
 */
export class OpenAICompatibleAdapter implements LLMAdapter {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = {
      baseUrl: config.baseUrl || 'https://api.openai.com/v1',
      apiKey: config.apiKey,
      defaultModel: config.defaultModel || 'gpt-4',
      maxTokens: config.maxTokens ?? 4096,
      temperature: config.temperature ?? 0.7,
    };
  }

  name(): string {
    return 'OpenAI Compatible';
  }

  supportedModels(): string[] {
    return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini'];
  }

  /**
   * 构建消息数组
   */
  private buildMessages(params: ChatRequestParams): ChatMessage[] {
    const messages: ChatMessage[] = [];

    // 系统提示
    messages.push({
      role: 'system',
      content: params.systemPrompt,
    });

    // 历史消息
    for (const msg of params.history) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // 用户当前消息
    messages.push({
      role: 'user',
      content: params.userMessage,
    });

    return messages;
  }

  /**
   * 非流式对话
   */
  async chat(params: ChatRequestParams): Promise<string> {
    const messages = this.buildMessages(params);

    const request: OpenAIRequest = {
      model: this.config.defaultModel,
      messages,
      stream: false,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data: OpenAIResponse = await response.json();

    const choice = data.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('No response from LLM');
    }

    return choice.message.content;
  }

  /**
   * 流式对话
   * 使用 SSE (Server-Sent Events) 解析流式响应
   */
  async chatStream(params: ChatRequestParams, onChunk: StreamCallback): Promise<string> {
    const messages = this.buildMessages(params);

    const request: OpenAIRequest = {
      model: this.config.defaultModel,
      messages,
      stream: true,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // 解析 SSE 数据
        const lines = buffer.split('\n');
        buffer = '';

        for (const line of lines) {
          // SSE 数据格式: "data: {...}"
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);

            // 结束标记
            if (dataStr === '[DONE]') {
              continue;
            }

            try {
              const data: StreamResponse = JSON.parse(dataStr);
              const choice = data.choices[0];

              if (choice?.delta?.content) {
                const chunk = choice.delta.content;
                fullContent += chunk;
                onChunk(chunk);
              }
            } catch {
              // JSON 解析失败，可能是部分数据，保留在 buffer
              buffer = line;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullContent;
  }
}

/**
 * 创建 OpenAI Compatible 适配器
 */
export function createOpenAIAdapter(config: OpenAIConfig): LLMAdapter {
  return new OpenAICompatibleAdapter(config);
}