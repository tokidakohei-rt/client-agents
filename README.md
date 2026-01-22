# Client Management Agents v1.1

**最終更新**: 2026年1月22日  
**バージョン**: 1.1  

---

## 概要

Client Management Agentsは、**Pipedrive CRM**と**Slack**を有機的に連携し、営業〜カスタマーサクセスまで一気通貫でクライアントを管理するマルチエージェントシステムです。

Claude Codeを活用し、以下を実現します：

- ファネル全体の状況分析・歩留まり特定
- 個別クライアントのヘルスチェック・リスク予測
- **Pipedrive + Slack + Email の統合360°ビュー**
- アクション実行支援（メール作成、日程調整等）
- Pipedriveへの操作・アクションログ記録
- **Slackの営業チャンネル活動サマリー**

---

## クイックスタート

### 1. 最初に読むファイル

```
📄 CLAUDE.md  ← Claude Codeが最初に読むべきファイル
```

### 2. システムを理解する

```
1. agents/main/MASTER_RULES.md - 最上位ルール
2. agents/main/AGENTS.md - エージェント詳細
3. agents/main/ROUTING.md - ルーティング規約
```

### 3. タスクを実行

Claude Codeに自然言語で指示：

```
「今日のファネル状況を教えて」
「〇〇社のステータスを確認して」
「フォローアップメールを作成して」
```

---

## システム構成

### エージェント一覧（10体）

```
TEAM A: Core（コア）
├── DP: Dispatcher      - タスク判定・振り分け
├── FR: Framer          - 非定型タスクのフレーミング
└── RV: Reviewer        - 品質レビュー

TEAM B: Analysis（分析）
├── FM: Funnel Monitor  - ファネル分析・歩留まり特定
└── SA: Strategy Advisor - 戦略評価・軌道修正提案 🆕

TEAM C: Client Intelligence（クライアント診断）
├── CT: Client Triager  - クライアント診断・360°ビュー（Slack統合）
└── RP: Risk Predictor  - リスク予測・早期警告

TEAM D: Execution（実行）
├── EX: Executor        - アクション実行・Pipedrive操作
├── CM: Communication Manager - コミュニケーション最適化
└── SC: Scheduler       - 日程調整・空き確認
```

### 外部連携

| サービス | 機能 | 権限 |
|---------|------|------|
| **Pipedrive CRM** | クライアントデータ・メール・カレンダー | Read/Write |
| **Slack MCP** | 営業チャンネルの会話・検索 | Read（投稿も可） |

**✅ 統合データアクセス**:
- **Pipedrive**: Deal、Person、Organization、Notes、Activities
- **Slack**: 営業チャンネルの会話、スレッド、検索
- **Email**: Pipedriveの同期機能経由で取得
- **Calendar**: Pipedriveの同期機能経由で取得

**🔗 統合の価値**:
- クライアントの360°ビュー（PD + Slack + Email を統合）
- 営業チャンネルの議論をCRM情報と突合
- 対応漏れの検出（Slack依頼 vs PD活動）

---

## ファネル定義

### Sales Phase（営業）

```
Lead → Appointment → Opportunity → Proposal → Won
```

| ステージ | 説明 | 主要KPI |
|---------|------|---------|
| Lead | リード獲得 | リード数 |
| Appointment | アポ獲得 | アポ率 |
| Opportunity | 商談 | 商談進捗率 |
| Proposal | 提案 | 提案採用率 |
| Won | 成約 | 成約率 |

### CS Phase（カスタマーサクセス）

```
Onboarding → Adoption → Expansion → Renewal
```

| ステージ | 説明 | 主要KPI |
|---------|------|---------|
| Onboarding | 導入支援 | 初期設定完了率 |
| Adoption | 定着 | アクティブ率 |
| Expansion | 拡大 | アップセル率 |
| Renewal | 更新 | 更新率 |

---

## 使い方

### 定型タスク（高速実行）

DPが判定し、直接実行します。

```
「今日のファネル状況は？」
  → DP → FM → 結果出力

「〇〇社のステータスは？」
  → DP → CT → RV → 結果出力

「来週の空き時間を確認して」
  → DP → SC → 結果出力

「〇〇社の360°ビューを見せて」🆕
  → DP → CT（Slack+PD+Email統合）→ RV → 結果出力

「今日のSlack営業チャンネルまとめ」🆕
  → DP → FM（Slack分析）→ RV → 結果出力
```

### 非定型タスク（品質重視）

DPが判定し、FRでフレーミング後に実行します。

```
「歩留まりが悪い原因を分析して」
  → DP → FR → FM → CT → EX → RV → 結果出力

「チャーンリスクの高い顧客への介入計画を立てて」
  → DP → FR → CT + RP → EX + CM → RV → 結果出力

「今週の戦略を見直して」🆕
  → DP → FR → FM + CT + RP → SA（戦略評価）→ RV → 結果出力
```

---

## ディレクトリ構造

```
client-agents/
├── CLAUDE.md              # Claude Code使用原則（最初に読む）
├── README.md              # 本ファイル
│
├── agents/main/           # エージェント定義
│   ├── MASTER_RULES.md    # 最上位ルール
│   ├── AGENTS.md          # 各エージェント詳細
│   ├── TEAMS.md           # チーム定義
│   └── ROUTING.md         # ルーティング規約
│
├── integrations/          # 外部連携
│   ├── pipedrive/         # Pipedrive API連携（メール・カレンダー同期含む）
│   └── slack-mcp/         # Slack MCP Server（営業チャンネル連携）🆕
│
├── inputs/                # 知識ベース
│   ├── funnel_definition.md
│   ├── client_health_criteria.md
│   ├── action_playbook.md
│   └── email_templates/
│
├── skills/                # スキル定義
│   ├── common/
│   └── specialized/
│
├── outputs/               # 成果物
│   ├── daily-reports/
│   ├── client-actions/
│   └── feedback/
│
└── templates/             # テンプレート
```

---

## 重要ルール

### 1. DPから開始

すべてのタスクはDP (Dispatcher) から開始します。

### 2. Pipedrive書き込み前に確認

書き込み操作を行う前に、必ずユーザーに確認を求めます。

### 3. アクションログの記録

重要なアクションはPipedriveのノートとして記録します。

### 4. 迷ったら人間に確認

判断に迷った場合は、必ずユーザーに確認を求めます。

---

## セットアップ

### 1. Pipedrive API設定

1. Pipedriveの設定からAPIトークンを取得
   - **設定** → **パーソナル設定** → **API**
2. 環境変数に設定：
   ```bash
   export PIPEDRIVE_API_TOKEN="your-token-here"
   ```

### 2. Pipedriveの同期設定（重要）

以下がPipedriveで有効になっていることを確認：

| 機能 | 設定場所 |
|------|---------|
| **メール同期** | 設定 → メール同期 → Gmail接続 |
| **カレンダー同期** | 設定 → カレンダー同期 → Google Calendar接続 |

これにより、Google APIを別途設定せずにメール・カレンダー情報を取得できます。

### 3. Slack MCP設定 🆕

1. Slack Appを作成しトークンを取得
   - https://api.slack.com/apps
   - Bot Token Scopes: `channels:read`, `chat:write`, `users:read`, `channels:history`, `reactions:write`
   - User Token Scopes: `search:read`（検索機能用）

2. 環境変数に設定：
   ```bash
   export SLACK_BOT_TOKEN="xoxb-your-bot-token"
   export SLACK_USER_TOKEN="xoxp-your-user-token"
   ```

3. Cursor/Claude Codeの`.cursor/mcp.json`に設定：
   ```json
   {
     "mcpServers": {
       "slack": {
         "command": "node",
         "args": ["/path/to/client-agents/integrations/slack-mcp/dist/index.js"],
         "env": {
           "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
           "SLACK_USER_TOKEN": "${SLACK_USER_TOKEN}",
           "SLACK_SAFE_SEARCH": "true"
         }
       }
     }
   }
   ```

詳細は `integrations/slack-mcp/README.md` を参照してください。

---

## トラブルシューティング

### エージェントが正しく動作しない

1. `CLAUDE.md` を再読み込み
2. `agents/main/MASTER_RULES.md` を確認
3. `agents/main/ROUTING.md` でルーティングルールを確認

### API連携エラー

1. 環境変数を確認
2. `integrations/` フォルダのドキュメントを参照
3. APIレート制限に注意

---

## ベストプラクティス

### DO ✅

- ✅ 自然言語で指示する
- ✅ 具体的なクライアント名を指定
- ✅ Pipedrive操作時は確認に応じる
- ✅ アクションログを活用する

### DON'T ❌

- ❌ DPをスキップしてエージェントを直接呼ばない
- ❌ Pipedrive書き込みを無断で実行しない
- ❌ 全エージェントを同時に起動しない

---

## 詳細ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [agents/main/MASTER_RULES.md](agents/main/MASTER_RULES.md) | 最上位ルール |
| [agents/main/AGENTS.md](agents/main/AGENTS.md) | 各エージェント詳細 |
| [agents/main/TEAMS.md](agents/main/TEAMS.md) | チーム定義 |
| [agents/main/ROUTING.md](agents/main/ROUTING.md) | ルーティング規約 |

---

## バージョン履歴

| バージョン | 日付 | 主な変更 |
|----------|------|---------|
| **v1.1** | 2026-01-22 | Slack MCP統合、360°ビュー、SA追加（10エージェント構成） |
| **v1.0** | 2026-01-20 | 初期リリース。Pipedrive/Calendar連携、9エージェント構成 |

---

## ライセンス

内部利用のみ。

---

**⚠️ 重要**: このシステムは業務支援ツールです。最終的な判断は必ず人間が行ってください。

---

**Client Management Agents v1.1** - Powered by Claude Code
