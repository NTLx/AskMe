/**
 * Tags 标签管理页面 - Material Design 3 设计规范
 * - 标签列表展示
 * - 创建/编辑/删除标签
 * - 标签颜色选择
 */

import { useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { BottomNav } from '../../BottomNav';
import type { Tag } from '../../../types';

/**
 * 预定义标签颜色
 */
const TAG_COLORS = [
  { id: 'primary', value: 'var(--primary)', name: 'Primary' },
  { id: 'secondary', value: 'var(--secondary)', name: 'Secondary' },
  { id: 'tertiary', value: 'var(--tertiary)', name: 'Tertiary' },
  { id: 'red', value: '#ef4444', name: 'Red' },
  { id: 'orange', value: '#f97316', name: 'Orange' },
  { id: 'amber', value: '#f59e0b', name: 'Amber' },
  { id: 'green', value: '#22c55e', name: 'Green' },
  { id: 'teal', value: '#14b8a6', name: 'Teal' },
  { id: 'blue', value: '#3b82f6', name: 'Blue' },
  { id: 'indigo', value: '#6366f1', name: 'Indigo' },
  { id: 'purple', value: '#a855f7', name: 'Purple' },
  { id: 'pink', value: '#ec4899', name: 'Pink' },
];

/**
 * 默认标签列表
 */
const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Important', color: 'var(--primary)', createdAt: Date.now(), updatedAt: Date.now(), sessionCount: 12 },
  { id: '2', name: 'Research', color: 'var(--tertiary)', createdAt: Date.now(), updatedAt: Date.now(), sessionCount: 8 },
  { id: '3', name: 'Ideas', color: '#f97316', createdAt: Date.now(), updatedAt: Date.now(), sessionCount: 5 },
  { id: '4', name: 'Follow-up', color: '#22c55e', createdAt: Date.now(), updatedAt: Date.now(), sessionCount: 3 },
];

interface TagsProps {
  tags?: Tag[];
  onCreateTag?: (tag: Tag) => void;
  onUpdateTag?: (tag: Tag) => void;
  onDeleteTag?: (tagId: string) => void;
}

export function Tags({
  tags = DEFAULT_TAGS,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagsProps) {
  // 状态
  const [isCreating, setIsCreating] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0].value);
  const [newTagDescription, setNewTagDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤标签
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 创建新标签
  const handleCreate = useCallback(() => {
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name: newTagName,
      color: newTagColor,
      description: newTagDescription,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sessionCount: 0,
    };
    onCreateTag?.(newTag);
    setNewTagName('');
    setNewTagColor(TAG_COLORS[0].value);
    setNewTagDescription('');
    setIsCreating(false);
  }, [newTagName, newTagColor, newTagDescription, onCreateTag]);

  // 更新标签
  const handleUpdate = useCallback((tag: Tag) => {
    onUpdateTag?.(tag);
    setEditingTagId(null);
  }, [onUpdateTag]);

  // 删除标签
  const handleDelete = useCallback((tagId: string) => {
    onDeleteTag?.(tagId);
  }, [onDeleteTag]);

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
            Tags
            <span className="text-on-surface-variant/40 font-normal ml-2">标签</span>
          </h3>

          {/* 描述 */}
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl leading-relaxed mt-3">
            Organize your conversations with custom tags. Create color-coded labels to quickly find and categorize your thought sessions.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 md:px-12 pb-32">
        {/* Search and Create */}
        <section className="flex flex-wrap gap-4 mb-8">
          {/* 搜索框 */}
          <div className="flex-1 min-w-[200px]">
            <Input
              value={searchQuery}
              placeholder="Search tags..."
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<span className="material-symbols-outlined text-sm">search</span>}
            />
          </div>

          {/* 创建按钮 */}
          <Button
            variant="primary"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Tag
          </Button>
        </section>

        {/* 创建新标签表单 */}
        {isCreating && (
          <section className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 mb-8 animate-fade-in-up">
            <h4 className="text-lg font-bold text-on-surface mb-4">New Tag</h4>

            {/* 名称输入 */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-on-surface mb-2">Tag Name</label>
              <Input
                value={newTagName}
                placeholder="Enter tag name..."
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>

            {/* 颜色选择 */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-on-surface mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setNewTagColor(color.value)}
                    className={cn(
                      'w-10 h-10 rounded-full transition-all duration-200',
                      newTagColor === color.value
                        ? 'ring-2 ring-on-surface ring-offset-2 ring-offset-surface scale-110'
                        : 'hover:scale-105'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* 描述 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-on-surface mb-2">Description (Optional)</label>
              <Input
                value={newTagDescription}
                placeholder="Brief description..."
                onChange={(e) => setNewTagDescription(e.target.value)}
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button variant="primary" onClick={handleCreate} disabled={!newTagName.trim()}>
                Create
              </Button>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </section>
        )}

        {/* Tags Grid */}
        <section>
          <h4 className="text-lg font-bold text-on-surface mb-4">
            Your Tags
            <span className="text-on-surface-variant text-sm font-normal ml-2">
              ({filteredTags.length} tags)
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                isEditing={editingTagId === tag.id}
                onEdit={() => setEditingTagId(tag.id)}
                onSave={(updatedTag) => handleUpdate(updatedTag)}
                onCancel={() => setEditingTagId(null)}
                onDelete={() => handleDelete(tag.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTags.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">label_off</span>
              </div>
              <h5 className="text-lg font-semibold text-on-surface mb-2">No tags found</h5>
              <p className="text-on-surface-variant">
                {searchQuery ? 'Try a different search term' : 'Create your first tag to organize conversations'}
              </p>
            </div>
          )}
        </section>

        {/* Usage Statistics */}
        <section className="mt-8 bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10">
          <h4 className="text-lg font-bold text-on-surface mb-4">Tag Usage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Total Tags</span>
              <span className="text-2xl font-bold text-on-surface">{tags.length}</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Most Used</span>
              <span className="text-2xl font-bold text-on-surface">{Math.max(...tags.map(t => t.sessionCount || 0), 0)}</span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Avg Usage</span>
              <span className="text-2xl font-bold text-on-surface">
                {Math.round(tags.reduce((sum, t) => sum + (t.sessionCount || 0), 0) / tags.length) || 0}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1 block">Colors Used</span>
              <span className="text-2xl font-bold text-on-surface">{new Set(tags.map(t => t.color)).size}</span>
            </div>
          </div>
        </section>
      </main>

      {/* 底部导航栏 */}
      <BottomNav activeItem="profile" onNavigate={() => {}} />
    </div>
  );
}

/**
 * 单个标签卡片组件
 */
interface TagCardProps {
  tag: Tag;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (tag: Tag) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function TagCard({ tag, isEditing, onEdit, onSave, onCancel, onDelete }: TagCardProps) {
  const [editName, setEditName] = useState(tag.name);
  const [editColor, setEditColor] = useState(tag.color);

  const handleSave = () => {
    onSave({
      ...tag,
      name: editName,
      color: editColor,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 transition-all duration-200 hover:shadow-md">
      {isEditing ? (
        // 编辑模式
        <div className="space-y-4">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Tag name"
          />
          <div className="flex flex-wrap gap-2">
            {TAG_COLORS.slice(0, 6).map((color) => (
              <button
                key={color.id}
                onClick={() => setEditColor(color.value)}
                className={cn(
                  'w-8 h-8 rounded-full transition-all duration-200',
                  editColor === color.value
                    ? 'ring-2 ring-on-surface ring-offset-1'
                    : ''
                )}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        // 显示模式
        <div>
          {/* 颜色指示器和名称 */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tag.color }}
            >
              <span className="material-symbols-outlined text-white/80">label</span>
            </div>
            <div>
              <h5 className="font-semibold text-on-surface">{tag.name}</h5>
              {tag.description && (
                <p className="text-xs text-on-surface-variant">{tag.description}</p>
              )}
            </div>
          </div>

          {/* 使用计数 */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-on-surface-variant">
              {tag.sessionCount} conversations
            </span>
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tags;