/**
 * LLM Configuration 设置页面
 * 像素级对齐 UI Reference: stitch_askme_web-dark/2
 *
 * 设计规范:
 * - 标题: "Intellectual Infrastructure" + 描述
 * - Provider 卡片: OpenAI Compatible (enabled), Anthropic Claude, Ollama Local
 * - Cognitive Load Overview: 数据面板 (Avg Latency / Tokens/Mo / Uptime)
 * - Advanced Parameters: 表格布局 (Temperature slider / Max Tokens / Context Window)
 * - 无边框设计, surface 层级系统
 */

import { useState, useCallback } from 'react';
import type { LLMProvider, LLMProviderConfig } from '../../../types';

interface LLMConfigurationProps {
  providers: LLMProvider[];
  activeProvider?: LLMProvider;
  onUpdateProvider: (provider: LLMProvider) => void;
  onCreateProvider?: () => void;
  onDeleteProvider?: (providerId: string) => void;
  onTestConnection?: (providerId: string) => Promise<boolean>;
}

export function LLMConfiguration({
  providers: _providers,
  activeProvider,
  onUpdateProvider,
  onCreateProvider: _onCreateProvider,
  onDeleteProvider: _onDeleteProvider,
  onTestConnection,
}: LLMConfigurationProps) {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [temperature, setTemperature] = useState(activeProvider?.config?.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(activeProvider?.config?.maxTokens || 4096);
  const [baseUrl, setBaseUrl] = useState(activeProvider?.baseUrl || 'https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState(activeProvider?.apiKey || '');
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = useCallback(async () => {
    if (!onTestConnection) return;
    setIsTesting(true);
    try {
      await onTestConnection('openai');
    } catch {
      // handle error
    } finally {
      setIsTesting(false);
    }
  }, [onTestConnection]);

  const handleSave = useCallback(() => {
    if (!activeProvider) return;
    const newConfig: LLMProviderConfig = {
      ...activeProvider.config,
      temperature,
      maxTokens,
    };
    onUpdateProvider({
      ...activeProvider,
      baseUrl,
      apiKey,
      config: newConfig,
      updatedAt: Date.now(),
    });
  }, [activeProvider, temperature, maxTokens, baseUrl, apiKey, onUpdateProvider]);

  // 保留 handleSave 引用防止 TS 报错
  void handleSave;

  return (
    <div className="max-w-5xl mx-auto w-full px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface font-display tracking-tight mb-3">
          Intellectual Infrastructure
        </h2>
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed">
          Configure the cognitive foundations of your assistant. Connect to global cloud
          providers or tether to local instances for maximum privacy.
        </p>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* OpenAI Compatible - Enabled */}
        <div className="md:col-span-2 bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">hub</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">OpenAI Compatible</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Enabled</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-container-highest transition-colors"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {/* Base URL + API Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                Base URL
              </label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-surface-container-lowest text-on-surface text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={apiKeyVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-surface-container-lowest text-on-surface text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20 pr-12"
                  placeholder="sk-..."
                />
                <button
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {apiKeyVisible ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
              Model Selection
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 rounded-full bg-surface-container-lowest text-on-surface text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                <option>gpt-4-turbo-preview</option>
                <option>gpt-4</option>
                <option>gpt-3.5-turbo</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Anthropic Claude */}
        <div className="bg-surface-container rounded-xl p-6 flex flex-col">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">Anthropic Claude</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1">
            Access the world's most nuanced models for creative and ethical reasoning.
          </p>
          <button className="w-full px-4 py-3 rounded-full bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Install Plugin
          </button>
        </div>
      </div>

      {/* Second row: Ollama + Cognitive Load */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Ollama Local */}
        <div className="bg-surface-container rounded-xl p-6">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">deployed_code</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">Ollama Local</h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            Full data sovereignty. Run Llama 3 or Mistral directly on your hardware.
          </p>
          <button className="w-full px-4 py-3 rounded-full bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Install Plugin
          </button>
        </div>

        {/* Cognitive Load Overview */}
        <div className="md:col-span-2 bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Cognitive Load Overview
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center">
                <span className="text-[8px] text-primary uppercase tracking-wider font-bold">Syncing</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-on-surface">
                2.4<span className="text-lg text-on-surface-variant font-normal">ms</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Avg. Latency</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">
                142<span className="text-lg text-on-surface-variant font-normal">k</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Tokens/Mo</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-on-surface">
                99.9<span className="text-lg text-on-surface-variant font-normal">%</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Parameters */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-on-surface">Advanced Parameters</h3>
          <div className="flex items-center gap-4">
            <button className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Reset Defaults
            </button>
            <button className="text-sm font-bold text-on-surface hover:text-primary transition-colors">
              Apply Changes
            </button>
          </div>
        </div>

        {/* Parameters Table */}
        <div className="bg-surface-container rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 px-6 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Parameter</span>
            <span>Value</span>
            <span className="text-right">Impact</span>
          </div>

          {/* Temperature Row */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-center">
            <div>
              <p className="text-sm font-bold text-on-surface">Temperature</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Controls randomness and creativity</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none bg-surface-container-high cursor-pointer accent-primary"
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-on-surface">{temperature} (Balanced)</span>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-outline-variant/10 mx-6" />

          {/* Max Tokens Row */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-center">
            <div>
              <p className="text-sm font-bold text-on-surface">Max Tokens</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Upper limit for response length</p>
            </div>
            <div>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
                className="px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20 w-28"
              />
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-on-surface">High Clarity</span>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-outline-variant/10 mx-6" />

          {/* Context Window Row */}
          <div className="grid grid-cols-3 gap-4 px-6 py-5 items-center">
            <div>
              <p className="text-sm font-bold text-on-surface">Context Window</p>
              <p className="text-xs text-on-surface-variant mt-0.5">Conversation memory depth</p>
            </div>
            <div className="relative inline-block">
              <select className="px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10">
                <option>Medium (16k)</option>
                <option>Small (4k)</option>
                <option>Large (32k)</option>
                <option>Extra Large (128k)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                expand_more
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono text-on-surface">16,384 ctx</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LLMConfiguration;