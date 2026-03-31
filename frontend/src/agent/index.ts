/**
 * Agent 人格系统模块入口
 */

// 内置人格
export {
  BUILTIN_AGENTS,
  BUILTIN_AGENT_IDS,
  getBuiltinAgentProfiles,
  getBuiltinAgentById,
  isBuiltinAgentId,
  createAgentProfileFromDefinition,
} from './builtins';

// 解析器
export {
  parseIdentityMd,
  parseSoulMd,
  parseAgentsMd,
  buildSystemPrompt,
  parseAgentProfile,
  validateAgentProfile,
  type ParsedAgentProfile,
} from './parser';

// 加载器
export {
  getAgentLoader,
  setAgentLoader,
  listAgentProfiles,
  getAgentProfile,
  getAgentSystemPrompt,
  saveAgentProfile,
  deleteAgentProfile,
  createCustomAgentProfile,
  cloneAgentProfile,
  getDefaultAgentProfileId,
  agentProfileExists,
  exportAgentProfileFiles,
  type AgentLoader,
} from './loader';