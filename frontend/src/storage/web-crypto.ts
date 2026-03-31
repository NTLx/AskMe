/**
 * Web Crypto API 加密工具
 *
 * 使用 AES-GCM 算法加密 API Key 等敏感数据
 * Master Key 存储在 IndexedDB 中
 */

const IV_SIZE = 12; // AES-GCM 推荐 IV 镜度

/**
 * 生成随机 Master Key
 */
export async function generateMasterKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // 可导出
    ['encrypt', 'decrypt']
  );
}

/**
 * 导出 Master Key 为 raw 格式（用于存储）
 */
export async function exportMasterKey(key: CryptoKey): Promise<Uint8Array> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(exported);
}

/**
 * 从 raw 格式导入 Master Key
 */
export async function importMasterKey(keyData: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    keyData.buffer as ArrayBuffer,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 加密 API Key
 *
 * @param apiKey 要加密的 API Key
 * @param key 加密密钥（Master Key）
 * @returns Base64 编码的加密数据（IV + ciphertext）
 */
export async function encryptApiKey(apiKey: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(apiKey)
  );

  // 组合 iv + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Base64 编码
  return btoa(String.fromCharCode(...combined));
}

/**
 * 解密 API Key
 *
 * @param encrypted Base64 编码的加密数据
 * @param key 解密密钥（Master Key）
 * @returns 解密后的 API Key
 */
export async function decryptApiKey(encrypted: string, key: CryptoKey): Promise<string> {
  // Base64 解码
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  if (combined.length < IV_SIZE) {
    throw new Error('Invalid encrypted data: too short');
  }

  const iv = combined.slice(0, IV_SIZE);
  const ciphertext = combined.slice(IV_SIZE);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}

/**
 * 从密码派生加密密钥（可选方案）
 *
 * 使用 PBKDF2 算法，适用于用户设置密码的场景
 */
export async function deriveKeyFromPassword(
  password: string,
  salt?: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  // 使用固定 salt 或生成随机 salt
  const actualSalt = salt || encoder.encode('askme-web-salt-v1');

  // 导入密码作为密钥材料
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // 派生 AES-GCM 密钥
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: actualSalt.buffer as ArrayBuffer,
      iterations: 100000, // 安全的迭代次数
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * 生成唯一 ID（使用 Web Crypto）
 */
export function generateId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // UUID v4 格式
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // 版本 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // 变体 10xx

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * 获取当前时间戳（毫秒）
 */
export function timestampMs(): number {
  return Date.now();
}