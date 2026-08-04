# @pipeworx/rebrickable

[Rebrickable](https://rebrickable.com) MCP — LEGO sets, parts, minifigures, themes. Free API key required.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_REBRICKABLE_KEY`. BYO: `?_apiKey=…`.

## Tools

- `sets(query?, theme_id?, min_year?, max_year?, min_parts?, max_parts?, ordering?, page?, page_size?)` — search sets
- `set(set_num)` — single set
- `set_parts(set_num)` — parts in a set
- `set_minifigs(set_num)` — minifigs in a set
- `parts(query?, color_id?, part_cat_id?, ordering?, page?, page_size?)` — search parts
- `part(part_num)` — single part
- `themes()` — list themes
- `colors()` — list colors

## Data source

`https://rebrickable.com/api/v3/lego/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "rebrickable": {
      "url": "https://gateway.pipeworx.io/rebrickable/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Rebrickable data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
