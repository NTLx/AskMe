// LLM 适配器接口定义

import type { Message } from '../types';

/**
 * 聊天消息结构
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 聊天请求参数
 */
export interface ChatRequestParams {
  systemPrompt: string;
  history: Message[];
  userMessage: string;
}

/**
 * 流式响应回调
 */
export type StreamCallback = (chunk: string) => void;

/**
 * LLM 适配器接口
 * 所有 LLM 提供商必须实现此接口
 */
export interface LLMAdapter {
  /**
   * 获取适配器名称
   */
  name(): string;

  /**
   * 获取支持的模型列表
   */
  supportedModels(): string[];

  /**
   * 非流式对话
   * @param params 聊天请求参数
   * @returns AI 响应内容
   */
  chat(params: ChatRequestParams): Promise<string>;

  /**
   * 流式对话
   * @param params 聊天请求参数
   * @param onChunk 每次收到新内容时的回调
   * @returns 完整响应内容
   */
  chatStream(params: ChatRequestParams, onChunk: StreamCallback): Promise<string>;
}

/**
 * LLM 适配器配置基础接口
 */
export interface LLMAdapterConfig {
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  maxTokens?: number;
  temperature?: number;
}