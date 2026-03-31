/**
 * LLM 配置设置页面 - Material Design 3 设计规范
 * - API Key 输入（带显示/隐藏切换）
 * - Model 选择下拉框
 * - Temperature 滑块
 * - 其他参数配置
 */

import { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { BottomNav } from '../../BottomNav';
import type { LLMProvider, LLMProviderConfig } from '../../../types';

/**
 * LLM 提供商图标映射
 */
const LLM_ICONS: Record<string, string> = {
  openai_compatible: '🟢',
  anthropic: '🔵',
  ollama: '🦙',
  custom: '⚙️',
};

/**
 * 可用模型列表
 */
const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: '最强大的模型，适合复杂任务' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '更快更便宜的 GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，适合日常对话' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Anthropic 最强模型' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: '平衡的性能与速度' },
];

/**
 * Temperature 预设值
 */
const TEMPERATURE_PRESETS = [
  { value: 0.3, label: 'Conservative', description: '精确、确定性高' },
  { value: 0.7, label: 'Balanced', description: '平衡创意与准确' },
  { value: 1.0, label: 'Creative', description: '创意、多样性高' },
];

interface LLMConfigurationProps {
  providers: LLMProvider[];
  activeProvider?: LLMProvider;
  onUpdateProvider: (provider: LLMProvider) => void;
  onCreateProvider?: () => void;
  onDeleteProvider?: (providerId: string) => void;
  onTestConnection?: (providerId: string) => Promise<boolean>;
}

export function LLMConfiguration({
  providers,
  activeProvider,
  onUpdateProvider,
  onCreateProvider,
  onDeleteProvider: _onDeleteProvider,
  onTestConnection,
}: LLMConfigurationProps) {
  // 状态
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [temperature, setTemperature] = useState(activeProvider?.config.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(activeProvider?.config.maxTokens || 4096);
  const [selectedModel, setSelectedModel] = useState(activeProvider?.config.defaultModel || 'gpt-4');
  const [baseUrl, setBaseUrl] = useState(activeProvider?.baseUrl || '');
  const [apiKey, setApiKey] = useState(activeProvider?.apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState(activeProvider?.id || providers[0]?.id);

  // 获取选中的 provider
  const currentProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  // 处理测试连接
  const handleTestConnection = useCallback(async () => {
    if (!onTestConnection || !selectedProviderId) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await onTestConnection(selectedProviderId);
      setTestResult(success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  }, [onTestConnection, selectedProviderId]);

  // 处理保存
  const handleSave = useCallback(() => {
    if (!currentProvider) return;
    const newConfig: LLMProviderConfig = {
      ...currentProvider.config,
      temperature,
      maxTokens,
      defaultModel: selectedModel,
    };
    onUpdateProvider({
      ...currentProvider,
      baseUrl,
      apiKey,
      config: newConfig,
      updatedAt: Date.now(),
    });
  }, [currentProvider, temperature, maxTokens, selectedModel, baseUrl, apiKey, onUpdateProvider]);

  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
          {/* System Preferences 标签 */}
          <div className="flex items-center gap-2 text-primary font-bold mb-2">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-xs uppercase tracking-widest">System Preferences</span>
          </div>

          {/* 页面标题 */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface">
            LLM Configuration
            <span className="text-on-surface-variant/40 font-normal ml-2">模型配置</span>
          </h3>

          {/* 描述 */}
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed mt-3">
            Configure your AI backend with custom endpoints, API keys, and fine-tuned parameters for optimal performance.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 pb-32">
        {/* Provider Selector */}
        <section className="mb-8">
          <h4 className="text-lg font-bold text-on-surface mb-4">Select Provider</h4>
          <div className="flex flex-wrap gap-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedProviderId(provider.id)}
                className={cn(
                  'px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-200',
                  'border border-outline-variant/20',
                  provider.id === selectedProviderId
                    ? 'bg-primary-container text-on-primary-container border-primary ring-2 ring-primary/20'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                )}
              >
                <span className="text-lg">{LLM_ICONS[provider.type] || '⚙️'}</span>
                <span className="font-medium">{provider.name}</span>
                {provider.isDefault && (
                  <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded-full ml-1">
                    Default
                  </span>
                )}
              </button>
            ))}
            {onCreateProvider && (
              <button
                onClick={onCreateProvider}
                className="px-4 py-3 rounded-xl flex items-center gap-2
                  bg-transparent text-primary border border-primary/30 hover:bg-primary-container/10 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span className="font-medium">Add Provider</span>
              </button>
            )}
          </div>
        </section>

        {/* Configuration Card */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-outline-variant/10 mb-8">
          {/* Base URL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-on-surface mb-2">Base URL</label>
            <Input
              value={baseUrl}
              placeholder="https://api.openai.com/v1"
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-on-surface-variant mt-2">OpenAI Compatible API endpoint</p>
          </div>

          {/* API Key */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-on-surface mb-2">API Key</label>
            <div className="relative">
              <Input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKey}
                placeholder="sk-..."
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pr-12"
              />
              <button
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                  text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {apiKeyVisible ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Your secret API key is stored locally</p>
          </div>

          {/* Model Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-on-surface mb-2">Default Model</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    'p-4 rounded-xl text-left transition-all duration-200 border',
                    selectedModel === model.id
                      ? 'bg-primary-container border-primary ring-2 ring-primary/20'
                      : 'bg-surface-container-high border-outline-variant/20 hover:bg-surface-container-highest'
                  )}
                >
                  <span className={cn(
                    'font-semibold text-sm',
                    selectedModel === model.id ? 'text-on-primary-container' : 'text-on-surface'
                  )}>
                    {model.name}
                  </span>
                  <span className={cn(
                    'text-xs block mt-1',
                    selectedModel === model.id ? 'text-on-primary-container/70' : 'text-on-surface-variant'
                  )}>
                    {model.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Parameters Card */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-[2rem] border border-outline-variant/10 mb-8">
          <h4 className="text-lg font-bold text-on-surface mb-2">Advanced Parameters</h4>
          <p className="text-sm text-on-surface-variant mb-6">Fine-tune the model behavior for optimal output</p>

          {/* Temperature Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-on-surface">Temperature</label>
              <span className="text-sm font-bold text-primary">{temperature}</span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-surface-container-high
                  cursor-pointer accent-primary"
              />
              {/* 滑块轨道标记 */}
              <div className="flex justify-between mt-2 text-xs text-on-surface-variant">
                <span>0 - Deterministic</span>
                <span>2 - Creative</span>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex gap-3 mt-4">
              {TEMPERATURE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setTemperature(preset.value)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    temperature === preset.value
                      ? 'bg-primary-container text-on-primary-container ring-2 ring-primary/20'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Tokens */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-on-surface">Max Output Tokens</label>
              <span className="text-sm font-bold text-primary">{maxTokens}</span>
            </div>
            <div className="flex gap-3">
              {[1024, 4096, 8192, 16384].map((tokens) => (
                <button
                  key={tokens}
                  onClick={() => setMaxTokens(tokens)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    maxTokens === tokens
                      ? 'bg-primary-container text-on-primary-container ring-2 ring-primary/20'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  )}
                >
                  {tokens >= 1000 ? `${tokens / 1000}k` : tokens}
                </button>
              ))}
            </div>
          </div>

          {/* Cognitive Load Overview */}
          <div className="mt-8 p-4 bg-surface-container-highest rounded-xl">
            <h5 className="text-sm font-semibold text-on-surface mb-4">Cognitive Load Overview</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CognitiveLoadIndicator
                label="Model Complexity"
                value={getModelComplexity(selectedModel)}
                max={5}
              />
              <CognitiveLoadIndicator
                label="Response Latency"
                value={getLatencyLevel(selectedModel)}
                max={5}
              />
              <CognitiveLoadIndicator
                label="Context Length"
                value={Math.min(Math.floor(maxTokens / 4096), 5)}
                max={5}
              />
              <CognitiveLoadIndicator
                label="Creativity Level"
                value={Math.round(temperature * 2.5)}
                max={5}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey}
            >
              {isTesting ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Testing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">wifi</span>
                  Test Connection
                </span>
              )}
            </Button>
            {testResult && (
              <span className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2',
                testResult === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              )}>
                <span className="material-symbols-outlined text-sm">
                  {testResult === 'success' ? 'check_circle' : 'error'}
                </span>
                {testResult === 'success' ? 'Connected' : 'Failed'}
              </span>
            )}
          </div>

          <Button variant="primary" onClick={handleSave}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Configuration
            </span>
          </Button>
        </section>
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="profile" onNavigate={() => {}} />
    </div>
  );
}

/**
 * 认知负载指示器组件
 */
interface CognitiveLoadIndicatorProps {
  label: string;
  value: number;
  max: number;
}

function CognitiveLoadIndicator({ label, value, max }: CognitiveLoadIndicatorProps) {
  const percentage = (value / max) * 100;
  const colorClass = value >= max * 0.8
    ? 'bg-red-400'
    : value >= max * 0.5
      ? 'bg-yellow-400'
      : 'bg-primary-container';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-on-surface-variant">{label}</span>
        <span className="font-bold text-on-surface">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 辅助函数：获取模型复杂度等级
 */
function getModelComplexity(model: string): number {
  if (model.includes('opus') || model.includes('gpt-4')) return 4;
  if (model.includes('sonnet') || model.includes('turbo')) return 3;
  return 2;
}

/**
 * 辅助函数：获取延迟等级
 */
function getLatencyLevel(model: string): number {
  if (model.includes('opus') || model.includes('gpt-4')) return 3;
  if (model.includes('sonnet') || model.includes('turbo')) return 2;
  return 1;
}

export default LLMConfiguration;