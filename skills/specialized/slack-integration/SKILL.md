# Slack Integration Skill

## 概要
Slack MCPサーバーを使用してSlack APIと連携し、営業関連の会話を取得・検索するスキル。

## 前提条件
- Slack MCP Serverがセットアップ済み
- 必要なSlackトークンが環境変数に設定済み
  - `SLACK_BOT_TOKEN`: Bot User OAuth Token
  - `SLACK_USER_TOKEN`: User OAuth Token（検索機能用）

## 利用可能なツール

### 1. slack_list_channels
チャンネル一覧を取得

```
用途: 営業関連チャンネルの特定
パラメータ:
  - cursor: ページネーション用カーソル（オプション）
  - limit: 取得件数（デフォルト: 100）
```

### 2. slack_search_messages
メッセージを検索（強力なフィルタ機能）

```
用途: 特定のクライアントや話題に関する会話を検索
パラメータ:
  - query: 検索クエリ（必須）
  - in_channel: チャンネル名でフィルタ
  - from_user: ユーザー名でフィルタ
  - before: この日付以前（YYYY-MM-DD）
  - after: この日付以降（YYYY-MM-DD）
  - on: 特定の日付（YYYY-MM-DD）
  - during: 期間（例: "January", "2024"）
  - sort: ソート順（relevance / timestamp）
  - count: 取得件数
```

**検索例:**
```
# ABC社に関する今週の会話
query: "ABC社"
in_channel: "sales"
after: "2026-01-15"

# 田中さんからの営業メッセージ
query: "商談"
from_user: "tanaka"
in_channel: "sales"

# 先月の価格に関する議論
query: "価格 OR 見積もり"
during: "December"
```

### 3. slack_get_channel_history
チャンネルの最新メッセージを取得

```
用途: 営業チャンネルの最新動向把握
パラメータ:
  - channel: チャンネルID（必須）
  - limit: 取得件数（オプション）
```

### 4. slack_get_thread_replies
スレッドの返信を取得

```
用途: 特定の議論の詳細を確認
パラメータ:
  - channel: チャンネルID（必須）
  - thread_ts: スレッドのタイムスタンプ（必須）
```

### 5. slack_search_channels
チャンネルを名前で検索

```
用途: クライアント専用チャンネルの発見
パラメータ:
  - query: 検索クエリ（部分一致）
```

### 6. slack_search_users
ユーザーを検索

```
用途: 担当者の特定
パラメータ:
  - query: 名前、表示名、実名で検索
```

### 7. slack_post_message
メッセージを投稿

```
用途: 営業チャンネルへの通知
パラメータ:
  - channel: チャンネルID（必須）
  - text: メッセージ本文（必須）
```

### 8. slack_reply_to_thread
スレッドに返信

```
用途: 既存の議論への追加コメント
パラメータ:
  - channel: チャンネルID（必須）
  - thread_ts: スレッドのタイムスタンプ（必須）
  - text: メッセージ本文（必須）
```

## 営業データ統合パターン

### パターン1: クライアント会話検索
```
1. クライアント名（会社名）でSlack検索
2. 関連チャンネルの特定
3. 最新スレッドの取得
4. Pipedriveの情報と突合
```

### パターン2: 日次営業活動サマリ
```
1. 営業チャンネルの今日の履歴取得
2. 重要なスレッドを特定
3. 各スレッドの返信を取得
4. サマリを生成
```

### パターン3: アクション漏れ検出
```
1. 営業チャンネルで「対応お願い」「確認お願い」等を検索
2. 解決済みかスレッドを確認
3. 未解決アイテムをリストアップ
```

## MCP Server設定

Claude Code（Cursor）で使用する場合、`~/.cursor/mcp.json`に以下を追加:

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": ["/Users/tokidakohei/Personal/client-agents/integrations/slack-mcp/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_USER_TOKEN": "${SLACK_USER_TOKEN}",
        "SLACK_SAFE_SEARCH": "true"
      }
    }
  }
}
```

## 注意事項
- `SLACK_SAFE_SEARCH=true`を設定すると、プライベートチャンネルとDMが検索から除外される
- 検索機能には`SLACK_USER_TOKEN`が必須
- チャンネルIDはチャンネル名とは異なる（`C01XXXXXXXX`形式）
- レート制限に注意（Slack APIは分あたりのリクエスト数に制限あり）
