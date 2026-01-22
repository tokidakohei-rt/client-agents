# Slack MCP Server

A [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) server for accessing Slack API. This server allows AI assistants to interact with the Slack API through a standardized interface.

> **Note**: This is a local implementation based on [ubie-oss/slack-mcp-server](https://github.com/ubie-oss/slack-mcp-server).

## Transport Support

This server supports both traditional and modern MCP transport methods:

- **Stdio Transport** (default): Process-based communication for local integration
- **Streamable HTTP Transport**: HTTP-based communication for web applications and remote clients

## Features

Available tools:

- `slack_list_channels` - List public channels in the workspace with pagination
- `slack_post_message` - Post a new message to a Slack channel
- `slack_reply_to_thread` - Reply to a specific message thread in Slack
- `slack_add_reaction` - Add a reaction emoji to a message
- `slack_get_channel_history` - Get recent messages from a channel
- `slack_get_thread_replies` - Get all replies in a message thread
- `slack_get_users` - Retrieve basic profile information of all users in the workspace
- `slack_get_user_profiles` - Get multiple users' profile information in bulk (efficient for batch operations)
- `slack_search_messages` - Search for messages in the workspace with powerful filters:
  - Basic query search
  - Location filters: `in_channel`
  - User filters: `from_user`
  - Date filters: `before` (YYYY-MM-DD), `after` (YYYY-MM-DD), `on` (YYYY-MM-DD), `during` (e.g., "July", "2023")
  - Sorting options by relevance score or timestamp
- `slack_search_channels` - Search for channels by partial name match
- `slack_search_users` - Search for users by name, display name, or real name

## Prerequisites

- Node.js (v18 or higher)
- Slack Bot User OAuth Token
- Slack User OAuth Token (required for search_messages)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set the following environment variables in `.env`:

- `SLACK_BOT_TOKEN`: Slack Bot User OAuth Token (required)
- `SLACK_USER_TOKEN`: Slack User OAuth Token (required for search features)
- `SLACK_SAFE_SEARCH` (optional): When set to `true`, automatically excludes private channels, DMs, and group DMs from search results

Example `.env` file:
```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_USER_TOKEN=xoxp-your-user-token-here
SLACK_SAFE_SEARCH=true
```

### 3. Getting Slack Tokens

1. Go to https://api.slack.com/apps
2. Create a new app or select an existing one
3. Navigate to "OAuth & Permissions"
4. Add the following **Bot Token Scopes**:
   - `channels:read`
   - `chat:write`
   - `users:read`
   - `users.profile:read`
   - `channels:history`
   - `reactions:write`
5. Add the following **User Token Scopes** (for search functionality):
   - `search:read`
6. Install the app to your workspace
7. Copy the "Bot User OAuth Token" and "User OAuth Token"

## Running Locally

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Command Line Options

**Stdio Transport (default)**:
```bash
node dist/index.js
```

**Streamable HTTP Transport**:
```bash
node dist/index.js -port 3000
```

Available options:
- `-port <number>`: Start with Streamable HTTP transport on specified port
- `-h, --help`: Show help message

## Usage with Claude Desktop

### Stdio Transport Configuration

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

**Option 1: Using tsx (No build required)** - Recommended for development:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/slack-mcp/src/index.ts"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_USER_TOKEN": "xoxp-your-user-token-here",
        "SLACK_SAFE_SEARCH": "true"
      }
    }
  }
}
```

**Option 2: Using built JavaScript** - Recommended for production:

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": ["/absolute/path/to/slack-mcp/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token-here",
        "SLACK_USER_TOKEN": "xoxp-your-user-token-here",
        "SLACK_SAFE_SEARCH": "true"
      }
    }
  }
}
```

**Important**:
- Replace `/absolute/path/to/slack-mcp` with the actual absolute path to this directory
- For Option 2, run `npm run build` first to compile TypeScript
- For Option 1, make sure you've run `npm install` to have tsx available

### HTTP Transport Configuration

Start the server:
```bash
SLACK_BOT_TOKEN=<your-bot-token> SLACK_USER_TOKEN=<your-user-token> node dist/index.js -port 3000
```

Connect to: `http://localhost:3000/mcp`

Health check available at: `http://localhost:3000/health`

## Implementation Pattern

This server adopts the following implementation pattern:

1. **Define request/response using Zod schemas**
   - Request schema: Define input parameters
   - Response schema: Define responses limited to necessary fields

2. **Implementation flow**:
   - Validate request with Zod schema
   - Call Slack WebAPI
   - Parse response with Zod schema to limit to necessary fields
   - Return as JSON

For example, the `slack_list_channels` implementation parses the request with `ListChannelsRequestSchema`, calls `slackClient.conversations.list`, and returns the response parsed with `ListChannelsResponseSchema`.

## Development

### Project Structure

```
slack-mcp/
├── src/
│   ├── index.ts      # Main server implementation
│   └── schemas.ts    # Zod schemas for validation
├── dist/             # Compiled TypeScript output
├── .env.example      # Environment variables template
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

### Available Scripts

- `npm run dev` - Start the server in development mode with hot reloading
- `npm run build` - Build the project for production
- `npm run start` - Start the production server

### Making Changes

1. Edit source files in the `src/` directory
2. Run `npm run dev` to test changes
3. Build with `npm run build` before deploying
4. Restart Claude Desktop to pick up changes

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Make sure to run `npm install`
   - If using Option 2 (built JS), rebuild with `npm run build`
   - If using Option 1 (tsx), no build is needed

2. **Authentication errors**
   - Verify your tokens are correct in `.env`
   - Check token scopes in Slack app settings
   - Ensure tokens haven't expired

3. **Claude Desktop doesn't connect**
   - Use absolute paths in config
   - If using Option 2, check that the server builds successfully with `npm run build`
   - If using Option 1, verify tsx is installed with `npm install`
   - Restart Claude Desktop after config changes

4. **Search not working**
   - Ensure `SLACK_USER_TOKEN` is set
   - Verify user token has `search:read` scope

5. **tsx not found**
   - Run `npm install` to install tsx
   - Alternatively, use Option 2 (built JavaScript) instead

## Publishing to GitHub Packages

This package is published to GitHub Packages registry.

### Setup for Publishing

1. Create a GitHub personal access token:
   - Go to https://github.com/settings/tokens/new
   - Select scopes: `read:packages`, `write:packages`

2. Configure npm authentication (at repository root):
   ```bash
   cd /path/to/newt-ai-ops
   cp .npmrc.example .npmrc
   # Edit .npmrc and replace YOUR_GITHUB_TOKEN with your token
   ```

3. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

### Installing from GitHub Packages

1. Create a GitHub personal access token:
   - Go to https://github.com/settings/tokens/new
   - Select scopes: `read:packages` (write:packages only needed for publishing)

2. Configure npm authentication at repository root:
   ```bash
   cd /path/to/newt-ai-ops
   cp .npmrc.example .npmrc
   # Edit .npmrc and replace YOUR_GITHUB_TOKEN with your token
   ```

3. Install the package:
   ```bash
   npm install @reiwa-travel/slack-mcp-server
   ```

### Using with Claude Desktop (Installed from GitHub Packages)

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

**For Stdio Transport (Claude Desktop, etc.)**:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@reiwa-travel/slack-mcp-server"
      ],
      "env": {
        "NPM_CONFIG_//npm.pkg.github.com/:_authToken": "<your-github-pat>",
        "SLACK_BOT_TOKEN": "<your-bot-token>",
        "SLACK_USER_TOKEN": "<your-user-token>",
        "SLACK_SAFE_SEARCH": "true"
      }
    }
  }
}
```

**For HTTP Transport**:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@reiwa-travel/slack-mcp-server",
        "-port",
        "3000"
      ],
      "env": {
        "NPM_CONFIG_//npm.pkg.github.com/:_authToken": "<your-github-pat>",
        "SLACK_BOT_TOKEN": "<your-bot-token>",
        "SLACK_USER_TOKEN": "<your-user-token>",
        "SLACK_SAFE_SEARCH": "true"
      }
    }
  }
}
```

## License

Based on [ubie-oss/slack-mcp-server](https://github.com/ubie-oss/slack-mcp-server) (Apache-2.0 License)
