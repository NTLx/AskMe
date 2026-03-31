/**
 * 设置面板 - 手机版全屏设计
 * 采用"Digital Nocturne"深色主题
 * - 全屏页面式设置（非模态框）
 * - 底部 Tab 导航
 * - Surface 层级系统
 */

import { useState } from 'react';
import { AppSettings, AgentProfile, LLMProvider } from '../types';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { AgentPersonas } from './pages/Settings/AgentPersonas';
import { LLMConfiguration } from './pages/Settings/LLMConfiguration';
import { BottomNav } from './BottomNav';

// 设置页签类型
type SettingsTab = 'agent' | 'llm' | 'general';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  agents: AgentProfile[];
  llmProviders: LLMProvider[];
  settings: AppSettings;
  onUpdateAgent: (agent: AgentProfile) => void;
  onCreateAgent: () => void;
  onDeleteAgent: (agentId: string) => void;
  onUpdateLLMProvider: (provider: LLMProvider) => void;
  onCreateLLMProvider: () => void;
  onDeleteLLMProvider: (providerId: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onTestLLMConnection?: (providerId: string) => Promise<boolean>;
}

const TAB_ITEMS: { id: SettingsTab; label: string; emoji: string }[] = [
  { id: 'agent', label: 'Agent', emoji: '🤖' },
  { id: 'llm', label: 'LLM', emoji: '⚡' },
  { id: 'general', label: 'General', emoji: '⚙️' },
];

export function Settings({
  isOpen,
  onClose,
  agents,
  llmProviders,
  settings,
  onUpdateAgent,
  onCreateAgent,
  onDeleteAgent: _onDeleteAgent,
  onUpdateLLMProvider,
  onCreateLLMProvider,
  onDeleteLLMProvider,
  onUpdateSettings,
  onTestLLMConnection,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('agent');

  if (!isOpen) return null;

  // 获取当前激活的 Agent ID
  const activeAgentId = agents.find(a => a.isActive)?.id || agents[0]?.id;

  // 处理 Agent 激活
  const handleActivateAgent = (agentId: string) => {
    agents.forEach(agent => {
      if (agent.isActive) {
        onUpdateAgent({ ...agent, isActive: false });
      }
    });
    const targetAgent = agents.find(a => a.id === agentId);
    if (targetAgent) {
      onUpdateAgent({ ...targetAgent, isActive: true });
    }
  };

  // 处理 Agent 编辑
  const handleEditAgent = (agent: AgentProfile) => {
    onUpdateAgent(agent);
  };

  // 处理 Agent 复制
  const handleCopyAgent = (agent: AgentProfile) => {
    const now = Date.now();
    onUpdateAgent({
      ...agent,
      id: `${agent.id}_copy_${now}`,
      name: `${agent.name} (副本)`,
      isBuiltin: false,
      isActive: false,
      createdAt: now,
      updatedAt: now,
    });
  };

  // 处理 LLM Provider 测试连接
  const handleTestLLMConnection = async (providerId: string): Promise<boolean> => {
    if (onTestLLMConnection) {
      return onTestLLMConnection(providerId);
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
              aria-label="关闭设置"
            >
              <span className="text-xl">←</span>
            </button>
            <h1 className="font-display text-xl font-bold text-on-surface">Settings</h1>
            <div className="w-9" /> {/* 占位保持居中 */}
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Configure your AI assistant preferences
          </p>
        </div>

        {/* Tab 导航 */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <span className="text-base">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 内容区域 */}
      <main className="max-w-lg mx-auto pb-32">
        {/* Agent 人格页签 */}
        {activeTab === 'agent' && (
          <div className="px-4 py-4">
            <AgentPersonas
              activeAgentId={activeAgentId}
              onActivateAgent={handleActivateAgent}
              onEditAgent={handleEditAgent}
              onCopyAgent={handleCopyAgent}
              onDeleteAgent={_onDeleteAgent}
              onCreateAgent={onCreateAgent}
            />
          </div>
        )}

        {/* LLM 配置页签 */}
        {activeTab === 'llm' && (
          <div className="px-4 py-4">
            <LLMConfiguration
              providers={llmProviders}
              onUpdateProvider={onUpdateLLMProvider}
              onCreateProvider={onCreateLLMProvider}
              onDeleteProvider={onDeleteLLMProvider}
              onTestConnection={handleTestLLMConnection}
            />
          </div>
        )}

        {/* 通用设置页签 */}
        {activeTab === 'general' && (
          <div className="px-4 py-4 space-y-4">
            {/* 主题设置 */}
            <section>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
                Theme
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => onUpdateSettings({ ...settings, theme })}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200',
                      settings.theme === theme
                        ? 'bg-primary-container text-on-primary ring-2 ring-primary/30'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    )}
                  >
                    <span className="text-2xl">
                      {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
                    </span>
                    <span className="text-xs font-medium">
                      {theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '系统'}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 会话设置 */}
            <section>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
                Session
              </h3>
              <div className="space-y-3">
                {/* 会话标题生成 */}
                <div className="bg-surface-container-lowest rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-on-surface">标题生成</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onUpdateSettings({ ...settings, autoGenerateTitle: true })}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs transition-all',
                          settings.autoGenerateTitle
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                        )}
                      >
                        自动
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, autoGenerateTitle: false })}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs transition-all',
                          !settings.autoGenerateTitle
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                        )}
                      >
                        手动
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant/80">
                    {settings.autoGenerateTitle
                      ? 'AI 将自动生成会话标题'
                      : '需要手动输入会话标题'}
                  </p>
                </div>

                {/* 输入框草稿 */}
                <div className="bg-surface-container-lowest rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-on-surface">草稿保留</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onUpdateSettings({ ...settings, preserveInputDraft: true })}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs transition-all',
                          settings.preserveInputDraft
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                        )}
                      >
                        保留
                      </button>
                      <button
                        onClick={() => onUpdateSettings({ ...settings, preserveInputDraft: false })}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs transition-all',
                          !settings.preserveInputDraft
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                        )}
                      >
                        清除
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant/80">
                    {settings.preserveInputDraft
                      ? '切换会话时保留未发送的内容'
                      : '切换会话时清除输入框'}
                  </p>
                </div>
              </div>
            </section>

            {/* 数据管理 */}
            <section>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3 px-1">
                Data
              </h3>
              <div className="space-y-3">
                <div className="bg-surface-container-lowest rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-on-surface">导出会话</span>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">
                        导出为 Markdown 格式
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-primary-container text-on-primary hover:bg-primary-fixed"
                    >
                      导出
                    </Button>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-on-surface">清理缓存</span>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">
                        清除临时文件和数据
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-on-surface-variant"
                    >
                      清理
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* 关于 */}
            <section className="pb-4">
              <div className="bg-surface-container-low rounded-2xl p-4 text-center">
                <p className="text-xs text-on-surface-variant">
                  AskMe v1.0.0 (MVP)
                </p>
                <p className="text-xs text-on-surface-variant/60 mt-1">
                  Built with ❤️ using React + Tauri
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="profile" onNavigate={() => {}} />
    </div>
  );
}

export default Settings;
