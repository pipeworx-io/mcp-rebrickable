interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Rebrickable MCP.
 */


const BASE = 'https://rebrickable.com/api/v3/lego';
const UA = 'pipeworx-mcp-rebrickable/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'sets',
    description: 'Search sets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        theme_id: { type: 'number' },
        min_year: { type: 'number' },
        max_year: { type: 'number' },
        min_parts: { type: 'number' },
        max_parts: { type: 'number' },
        ordering: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
    },
  },
  { name: 'set', description: 'Single set.', inputSchema: { type: 'object', properties: { set_num: { type: 'string' } }, required: ['set_num'] } },
  { name: 'set_parts', description: 'Parts in a set.', inputSchema: { type: 'object', properties: { set_num: { type: 'string' } }, required: ['set_num'] } },
  { name: 'set_minifigs', description: 'Minifigs in a set.', inputSchema: { type: 'object', properties: { set_num: { type: 'string' } }, required: ['set_num'] } },
  {
    name: 'parts',
    description: 'Search parts.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        color_id: { type: 'number' },
        part_cat_id: { type: 'number' },
        ordering: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
    },
  },
  { name: 'part', description: 'Single part.', inputSchema: { type: 'object', properties: { part_num: { type: 'string' } }, required: ['part_num'] } },
  { name: 'themes', description: 'List themes.', inputSchema: { type: 'object', properties: {} } },
  { name: 'colors', description: 'List colors.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Rebrickable requires an API key. Set PLATFORM_REBRICKABLE_KEY or pass ?_apiKey=… (free at https://rebrickable.com/api/).');
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(args)) {
    if (k === '_apiKey') continue;
    if (v == null) continue;
    p.set(k === 'query' ? 'search' : k, String(v));
  }
  const headers = { Accept: 'application/json', 'User-Agent': UA, Authorization: `key ${apiKey}` };
  const get = async (path: string) => {
    const res = await fetch(`${BASE}${path}`, { headers });
    if (res.status === 401) throw new Error('Rebrickable: 401 — invalid API key.');
    if (!res.ok) throw new Error(`Rebrickable: ${res.status}`);
    return res.json();
  };
  switch (name) {
    case 'sets':
      return get(`/sets/?${p}`);
    case 'set':
      return get(`/sets/${encodeURIComponent(reqStr(args, 'set_num', '"75192-1"'))}/`);
    case 'set_parts':
      return get(`/sets/${encodeURIComponent(reqStr(args, 'set_num', '"75192-1"'))}/parts/`);
    case 'set_minifigs':
      return get(`/sets/${encodeURIComponent(reqStr(args, 'set_num', '"75192-1"'))}/minifigs/`);
    case 'parts':
      return get(`/parts/?${p}`);
    case 'part':
      return get(`/parts/${encodeURIComponent(reqStr(args, 'part_num', '"3001"'))}/`);
    case 'themes':
      return get(`/themes/?page_size=1000`);
    case 'colors':
      return get(`/colors/?page_size=1000`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
