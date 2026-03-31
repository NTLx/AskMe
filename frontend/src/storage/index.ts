/**
 * Storage 模块入口
 *
 * 提供数据存储抽象层，支持 Web (IndexedDB) 和 Tauri (SQLite) 双后端
 */

export type { StorageProvider, StorageProviderFactory, ListSessionsOptions } from './interface';

export { IndexedDBProvider, createIndexedDBProvider } from './indexeddb-provider';
export { SQLiteProvider, createSQLiteProvider, isSQLiteProviderAvailable } from './sqlite-provider';
export {
  generateMasterKey,
  exportMasterKey,
  importMasterKey,
  encryptApiKey,
  decryptApiKey,
  deriveKeyFromPassword,
  generateId,
  timestampMs,
} from './web-crypto';

import type { StorageProvider } from './interface';
import { createIndexedDBProvider } from './indexeddb-provider';
import { createSQLiteProvider, isSQLiteProviderAvailable } from './sqlite-provider';

/**
 * 自动检测并创建合适的 StorageProvider
 *
 * Tauri 环境使用 SQLite Provider
 * Web 环境使用 IndexedDB Provider
 */
export async function createStorageProvider(): Promise<StorageProvider> {
  const isSQLiteAvailable = await isSQLiteProviderAvailable();

  if (isSQLiteAvailable) {
    console.log('[Storage] Using SQLite provider (Tauri)');
    return createSQLiteProvider();
  }

  console.log('[Storage] Using IndexedDB provider (Web)');
  return createIndexedDBProvider();
}

/**
 * 获取默认的 StorageProvider（单例模式）
 */
let defaultProvider: StorageProvider | null = null;

export async function getDefaultStorageProvider(): Promise<StorageProvider> {
  if (!defaultProvider) {
    defaultProvider = await createStorageProvider();
  }
  return defaultProvider;
}