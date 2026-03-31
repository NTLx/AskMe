/**
 * LLM 配置设置页面
 * Bento-ish 3 列布局设计
 * - OpenAI Compatible 大卡片（占据 2 列）
 * - 插件卡片（1 列）
 * - 认知负载概览区域
 * - 高级参数表格
 */

import { useState } from 'react';
import { LLMProvider, LLMProviderType, LLMProviderConfig } from '../../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { cn } from '../../../utils/cn';

// LLM 提供商图标映射
const LLM_ICONS: Record<LLMProviderType, string> = {
  openai_compatible: '🟢',
  anthropic: '🔵',
  ollama: '🦙',
  custom: '⚙️',
};

// 插件类型定义
interface PluginInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  isEnabled: boolean;
  status: 'active' | 'inactive' | 'error';
}

// 默认插件列表
const DEFAULT_PLUGINS: PluginInfo[] = [
  { id: 'browser', name: 'BrowserOS', icon: '🌐', description: '网页搜索与浏览', isEnabled: true, status: 'active' },
  { id: 'search', name: 'SearchTools', icon: '🔍', description: '多维度搜索', isEnabled: false, status: 'inactive' },
  { id: 'tools', name: 'ToolKit', icon: '🔧', description: '工具集成', isEnabled: false, status: 'inactive' },
];

// 认知负载维度
interface CognitiveLoadDimension {
  name: string;
  value: number;
  max: number;
  description: string;
}

// 高级参数定义
interface AdvancedParameter {
  key: string;
  label: string;
  type: 'number' | 'select' | 'text';
  value: string | number;
  options?: string[];
  description: string;
}

interface LLMConfigurationProps {
  providers: LLMProvider[];
  onUpdateProvider: (provider: LLMProvider) => void;
  onCreateProvider: () => void;
  onDeleteProvider: (providerId: string) => void;
  onTestConnection: (providerId: string) => Promise<boolean>;
}

export function LLMConfiguration({
  providers,
  onUpdateProvider,
  onCreateProvider,
  onDeleteProvider,
  onTestConnection,
}: LLMConfigurationProps) {
  const [activeProviderId, setActiveProviderId] = useState<string | null>(
    providers.find(p => p.isDefault)?.id || providers[0]?.id || null
  );
  const [plugins, setPlugins] = useState<PluginInfo[]>(DEFAULT_PLUGINS);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [editingProvider, setEditingProvider] = useState<LLMProvider | null>(null);

  // 获取当前激活的 Provider
  const activeProvider = providers.find(p => p.id === activeProviderId);

  // 计算认知负载维度
  const cognitiveLoad: CognitiveLoadDimension[] = [
    { name: '模型复杂度', value: 3, max: 5, description: '当前模型的理解能力层级' },
    { name: '响应延迟', value: 2, max: 5, description: '平均响应等待时间感知' },
    { name: '上下文长度', value: 4, max: 5, description: '可处理的对话历史容量' },
    { name: '插件活跃度', value: plugins.filter(p => p.isEnabled).length, max: 5, description: '启用的工具插件数量' },
  ];

  // 高级参数列表
  const advancedParameters: AdvancedParameter[] = [
    {
      key: 'maxTokens',
      label: '最大输出 Token',
      type: 'number',
      value: activeProvider?.config.maxTokens || 4096,
      description: '单次响应的最大长度',
    },
    {
      key: 'temperature',
      label: '温度系数',
      type: 'number',
      value: activeProvider?.config.temperature || 0.7,
      description: '创意性 vs 确定性平衡',
    },
    {
      key: 'defaultModel',
      label: '默认模型',
      type: 'select',
      value: activeProvider?.config.defaultModel || 'gpt-4',
      options: activeProvider?.config.models || ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      description: '每次对话使用的默认模型',
    },
  ];

  // 处理测试连接
  const handleTestConnection = async () => {
    if (!activeProviderId) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await onTestConnection(activeProviderId);
      setTestResult(success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    }
    setIsTesting(false);
  };

  // 处理参数更新
  const handleParameterChange = (key: string, value: string | number) => {
    if (!activeProvider) return;
    const newConfig: LLMProviderConfig = {
      ...activeProvider.config,
      [key]: value,
    };
    onUpdateProvider({
      ...activeProvider,
      config: newConfig,
      updatedAt: Date.now(),
    });
  };

  // 处理插件开关
  const handlePluginToggle = (pluginId: string) => {
    setPlugins(prev => prev.map(p =>
      p.id === pluginId
        ? { ...p, isEnabled: !p.isEnabled, status: !p.isEnabled ? 'active' : 'inactive' }
        : p
    ));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-on-surface">LLM 配置</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            管理语言模型提供商和高级参数设置
          </p>
        </div>
        <Button variant="primary" onClick={onCreateProvider}>
          + 添加提供商
        </Button>
      </div>

      {/* Bento Grid 布局 */}
      <div className="grid grid-cols-3 gap-4">
        {/* OpenAI Compatible 大卡片 - 占据 2 列 */}
        <Card variant="default" className="col-span-2 row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{activeProvider ? LLM_ICONS[activeProvider.type] : '🟢'}</span>
              {activeProvider?.name || 'OpenAI Compatible'}
            </CardTitle>
            <CardDescription>
              {activeProvider?.baseUrl || 'https://api.openai.com/v1'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Base URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Base URL</label>
              <Input
                value={editingProvider?.baseUrl || activeProvider?.baseUrl || ''}
                placeholder="https://api.openai.com/v1"
                onChange={(e) => {
                  if (activeProvider) {
                    setEditingProvider({
                      ...activeProvider,
                      baseUrl: e.target.value,
                    });
                  }
                }}
              />
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">API Key</label>
              <Input
                type="password"
                value={editingProvider?.apiKey || activeProvider?.apiKey || ''}
                placeholder="sk-..."
                onChange={(e) => {
                  if (activeProvider) {
                    setEditingProvider({
                      ...activeProvider,
                      apiKey: e.target.value,
                    });
                  }
                }}
              />
            </div>

            {/* 模型选择 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">可用模型</label>
              <div className="flex flex-wrap gap-2">
                {(activeProvider?.config.models || ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']).map((model) => (
                  <span
                    key={model}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm',
                      model === activeProvider?.config.defaultModel
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'bg-surface-container-high text-on-surface-variant'
                    )}
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Provider 选择器 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">切换提供商</label>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setActiveProviderId(provider.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all',
                      provider.id === activeProviderId
                        ? 'bg-primary-container text-on-primary-container font-semibold scale-[1.02]'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                    )}
                  >
                    <span>{LLM_ICONS[provider.type]}</span>
                    {provider.name}
                    {provider.isDefault && (
                      <span className="text-xs bg-surface-container-highest px-2 py-0.5 rounded-full">
                        默认
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? '测试中...' : '测试连接'}
              </Button>
              {testResult && (
                <span className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  testResult === 'success'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                )}>
                  {testResult === 'success' ? '连接成功' : '连接失败'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {editingProvider && (
                <Button
                  variant="primary"
                  onClick={() => {
                    onUpdateProvider(editingProvider);
                    setEditingProvider(null);
                  }}
                >
                  保存更改
                </Button>
              )}
              {activeProvider && !activeProvider.isDefault && (
                <Button
                  variant="outline"
                  onClick={() => onDeleteProvider(activeProvider.id)}
                >
                  删除
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* 插件卡片列 */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* 插件列表卡片 */}
          <Card variant="elevated" className="bg-surface-container-high">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">🔌</span>
                插件管理
              </CardTitle>
              <CardDescription>
                扩展 LLM 能力的工具插件
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl transition-colors',
                    plugin.isEnabled
                      ? 'bg-surface-container-highest'
                      : 'bg-surface-container-low'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{plugin.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-on-surface">{plugin.name}</span>
                      <span className="text-xs text-on-surface-variant ml-2">{plugin.description}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePluginToggle(plugin.id)}
                    className={cn(
                      'w-10 h-6 rounded-full transition-colors relative',
                      plugin.isEnabled
                        ? 'bg-primary-container'
                        : 'bg-surface-container-high'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full transition-transform',
                        plugin.isEnabled
                          ? 'translate-x-5 bg-on-primary-container'
                          : 'translate-x-1 bg-on-surface-variant'
                      )}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 提供商状态卡片 */}
          <Card variant="elevated" className="bg-surface-container-high">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                提供商状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm">
                      <span>{LLM_ICONS[provider.type]}</span>
                      {provider.name}
                    </span>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      provider.isEnabled
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-surface-container-high text-on-surface-variant'
                    )}>
                      {provider.isEnabled ? '启用' : '禁用'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 认知负载概览区域 */}
      <Card variant="filled" className="bg-surface-container-highest">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            认知负载概览
          </CardTitle>
          <CardDescription>
            当前配置对系统认知资源的影响分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {cognitiveLoad.map((dim) => (
              <div key={dim.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">{dim.name}</span>
                  <span className="text-xs text-on-surface-variant">{dim.value}/{dim.max}</span>
                </div>
                {/* 进度条 */}
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      dim.value >= dim.max * 0.8
                        ? 'bg-red-400'
                        : dim.value >= dim.max * 0.5
                        ? 'bg-yellow-400'
                        : 'bg-primary-container'
                    )}
                    style={{ width: `${(dim.value / dim.max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant">{dim.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 高级参数表格 */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            高级参数
          </CardTitle>
          <CardDescription>
            精细调整模型行为参数
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-on-surface">参数名称</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-on-surface">当前值</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-on-surface">说明</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-on-surface">操作</th>
                </tr>
              </thead>
              <tbody>
                {advancedParameters.map((param) => (
                  <tr key={param.key} className="border-b border-outline-variant/10 hover:bg-surface-bright transition-colors">
                    <td className="py-3 px-4 text-sm text-on-surface font-medium">{param.label}</td>
                    <td className="py-3 px-4">
                      {param.type === 'select' ? (
                        <select
                          value={param.value}
                          onChange={(e) => handleParameterChange(param.key, e.target.value)}
                          className="bg-surface-container-high rounded-full px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/20"
                        >
                          {param.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : param.type === 'number' ? (
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) => handleParameterChange(param.key, parseFloat(e.target.value))}
                          className="bg-surface-container-high rounded-full px-3 py-1.5 text-sm text-on-surface w-24 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      ) : (
                        <span className="text-sm text-on-surface-variant">{param.value}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant">{param.description}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        重置
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={() => {
            // 重置所有参数到默认值
            if (activeProvider) {
              onUpdateProvider({
                ...activeProvider,
                config: {
                  ...activeProvider.config,
                  maxTokens: 4096,
                  temperature: 0.7,
                },
                updatedAt: Date.now(),
              });
            }
          }}>
            重置全部
          </Button>
          <Button variant="primary">
            应用更改
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LLMConfiguration;