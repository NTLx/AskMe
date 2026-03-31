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
      <div className="mb-4">
        <h2 className="text-4xl font-extrabold tracking-tight mb-4">
          Intellectual Infrastructure
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
          Configure the cognitive foundations of your assistant. Connect to global cloud
          providers or tether to local instances for maximum privacy.
        </p>
      </div>

      {/* Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* OpenAI Compatible - Enabled */}
        <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-8 flex flex-col gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">hub</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">OpenAI Compatible</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Enabled
                </p>
              </div>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-full text-xs font-bold hover:bg-surface-bright transition-colors"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {/* Base URL + API Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant ml-2">
                Base URL
              </label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="bg-surface-container-lowest border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-outline-variant"
                placeholder="https://api.openai.com/v1"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant ml-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={apiKeyVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary/20 pr-12"
                  placeholder="sk-proj-••••••••••••••••"
                />
                <span
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                  className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm cursor-pointer"
                >
                  {apiKeyVisible ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
            <div className="col-span-full flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold text-on-surface-variant ml-2">
                Model Selection
              </label>
              <select className="bg-surface-container-lowest border-none rounded-full px-6 py-3 text-sm focus:ring-1 focus:ring-primary/20 appearance-none">
                <option>gpt-4o</option>
                <option>gpt-4-turbo-preview</option>
                <option>gpt-3.5-turbo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Anthropic Claude */}
        <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10 hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-fixed">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <h3 className="text-xl font-bold">Anthropic Claude</h3>
            <p className="text-sm text-on-surface-variant leading-snug">
              Access the world's most nuanced models for creative and ethical reasoning.
            </p>
          </div>
          <button className="mt-8 border border-outline-variant rounded-full py-3 text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-on-surface group-hover:text-surface transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Install Plugin
          </button>
        </div>
      </div>

      {/* Second row: Ollama + Cognitive Load */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Ollama Local */}
        <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10 hover:bg-surface-bright transition-all duration-300 group">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
            <h3 className="text-xl font-bold">Ollama Local</h3>
            <p className="text-sm text-on-surface-variant leading-snug">
              Full data sovereignty. Run Llama 3 or Mistral directly on your hardware.
            </p>
          </div>
          <button className="mt-8 border border-outline-variant rounded-full py-3 text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-on-surface group-hover:text-surface transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Install Plugin
          </button>
        </div>

        {/* Cognitive Load Overview */}
        <div className="col-span-1 md:col-span-2 bg-surface-container rounded-xl p-8 flex items-center gap-8 overflow-hidden relative">
          <div className="flex-grow">
            <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-6">
              Cognitive Load Overview
            </h4>
            <div className="flex gap-12">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold">
                  2.4<span className="text-sm text-on-surface-variant font-normal">ms</span>
                </span>
                <span className="text-[10px] text-primary font-bold">Avg. Latency</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold">
                  142<span className="text-sm text-on-surface-variant font-normal">k</span>
                </span>
                <span className="text-[10px] text-tertiary font-bold">Tokens/Mo</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold">
                  99.9<span className="text-sm text-on-surface-variant font-normal">%</span>
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold">Uptime</span>
              </div>
            </div>
          </div>
          <div className="w-32 h-32 hidden lg:flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute text-[10px] font-bold">SYNCING</div>
          </div>
        </div>
      </div>

      {/* Advanced Parameters */}
      <section className="mt-4">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold">Advanced Parameters</h3>
          <div className="flex gap-4">
            <button className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Reset Defaults
            </button>
            <button className="text-sm text-primary font-bold" onClick={handleSave}>
              Apply Changes
            </button>
          </div>
        </div>

        {/* Parameters Table */}
        <div className="bg-surface-container rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/10">
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  Parameter
                </th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                  Value
                </th>
                <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-bright/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold">Temperature</span>
                    <span className="text-xs text-on-surface-variant">Controls randomness and creativity</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-48 accent-primary"
                  />
                </td>
                <td className="px-8 py-6 text-right font-mono text-tertiary">
                  {temperature} (Balanced)
                </td>
              </tr>
              <tr className="hover:bg-surface-bright/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold">Max Tokens</span>
                    <span className="text-xs text-on-surface-variant">Upper limit for response length</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
                    className="bg-surface-container-lowest border-none rounded-lg px-4 py-2 text-sm w-32 focus:ring-1 focus:ring-primary/20"
                  />
                </td>
                <td className="px-8 py-6 text-right font-mono text-on-surface-variant">High Clarity</td>
              </tr>
              <tr className="hover:bg-surface-bright/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold">Context Window</span>
                    <span className="text-xs text-on-surface-variant">Conversation memory depth</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select defaultValue="Medium (16k)" className="bg-surface-container-lowest border-none rounded-lg px-4 py-2 text-sm w-48 focus:ring-1 focus:ring-primary/20 appearance-none">
                    <option>Short (4k)</option>
                    <option>Medium (16k)</option>
                    <option>Long (128k)</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right font-mono text-on-surface-variant">16,384 ctx</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default LLMConfiguration;