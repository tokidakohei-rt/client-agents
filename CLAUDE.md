# CLAUDE.md - Client Management Agents 使用原則

**このファイルはClaude Codeが最初に読むべきファイルです。**

---

## 概要

Client Management Agentsは、Pipedrive CRMとGoogle Calendarを連携し、営業〜カスタマーサクセスまで一気通貫でクライアントを管理するマルチエージェントシステムです。

---

## 絶対原則（必ず守ること）

### 1. 最初に読むファイル

Claude Codeセッション開始時、以下の順序で必ず読み込むこと：

```
1. CLAUDE.md（本ファイル）
2. agents/main/MASTER_RULES.md
3. agents/main/AGENTS.md
4. agents/main/WORKFLOWS.md      ← 継続的フロー
5. agents/main/ACTION_MENU.md    ← アクション選択
6. agents/main/ACTION_PERMISSIONS.md ← 承認ルール
7. agents/main/ROUTING.md
```

### 2. ディスパッチャー優先

すべてのタスクは**DP (Dispatcher)** から開始する。
DPがタスクタイプを判定し、適切なエージェントに振り分ける。

```
ユーザー指示 → DP（タスク判定）→ 適切なエージェント
```

### 3. 外部API操作の承認ルール

👉 詳細は `agents/main/ACTION_PERMISSIONS.md` を参照

#### 🟢 承認不要（即実行）
- ステージ移動
- ノート追加
- アクティビティ作成/更新/完了
- フォローアップ設定
- 全ての読み取り操作

#### 🟡 承認必要
- Deal/Person削除
- Deal金額変更
- Won/Lost処理
- メール送信

```markdown
## ⚠️ 承認が必要な操作です

| 項目 | 内容 |
|------|------|
| **対象** | [Deal/Person名] |
| **操作** | [操作内容] |
| **理由** | [なぜ必要か] |

→ 実行してよろしいですか？
```

### 4. アクションログの記録

エージェントが実行した重要なアクションは、Pipedriveのノートとして記録する。

### 5. 人間中心の原則

- 迷ったら必ずユーザーに確認
- 最終判断は人間が行う
- 勝手に仮置きして進めない

---

## システム構成

### エージェント一覧（10体）

| Team | Agent | 役割 |
|------|-------|------|
| Core | **DP** | タスク判定・振り分け |
| Core | **FR** | 非定型タスクのフレーミング |
| Core | **RV** | 品質レビュー |
| Analysis | **FM** | ファネル分析 |
| Analysis | **SA** | 🎯 戦略アドバイザー（SaaS営業戦略・軌道修正）🆕 |
| Intelligence | **CT** | クライアント診断 |
| Intelligence | **RP** | リスク予測 |
| Execution | **EX** | アクション実行 |
| Execution | **CM** | コミュニケーション最適化 |
| Execution | **SC** | 日程調整 |

### チーム構成

```
TEAM A: Core（常に起動）
  - DP: Dispatcher（タスク判定）
  - FR: Framer（非定型タスクのフレーミング）
  - RV: Reviewer（品質レビュー）

TEAM B: Analysis（分析・戦略）
  - FM: Funnel Monitor（ファネル分析）
  - SA: Strategy Advisor（戦略評価・軌道修正）🆕

TEAM C: Client Intelligence（クライアント診断）
  - CT: Client Triager（クライアント診断）
  - RP: Risk Predictor（リスク予測）

TEAM D: Execution（実行）
  - EX: Executor（アクション実行）
  - CM: Communication Manager（コミュニケーション最適化）
  - SC: Scheduler（日程調整）
```

### SA（Strategy Advisor）の自動起動

SAは以下のタイミングで自動的に起動し、クリティカルな視点を提供:

- **週次サマリー（WF-005）**: 必ず起動
- **ファネル異常検出時**: FM.alertsに"critical"が含まれる場合
- **大型案件**: deal.value > 100万円
- **戦略関連キーワード**: 「戦略」「戦術」「方針」「軌道修正」

---

## 外部連携

### Pipedrive CRM（メイン - これだけでOK！）

- **読み取り**: Deals, Pipelines, Persons, Organizations, Activities, Notes
- **書き込み**: Deals更新, Activities作成, Notes追加（要確認）
- **メール同期**: Pipedriveのメール同期機能でメール履歴を取得
- **カレンダー同期**: Pipedriveのカレンダー同期機能で予定を取得
- **APIトークン**: 環境変数 `PIPEDRIVE_API_TOKEN`

### Google API（オプション - 現在は不使用）

Gmail/Calendarは Pipedrive同期機能で代替するため、Google APIは不要です。

---

## ファイル構造

```
client-agents/
├── CLAUDE.md              ← 今ここ（最初に読む）
├── README.md              # システム全体ガイド
│
├── agents/main/           # エージェント定義
│   ├── MASTER_RULES.md    # 最上位ルール
│   ├── AGENTS.md          # 各エージェント詳細
│   ├── TEAMS.md           # チーム定義
│   └── ROUTING.md         # ルーティング規約
│
├── integrations/          # 外部連携
│   └── pipedrive/         # Pipedrive API（メール・カレンダー同期含む）
│
├── inputs/                # 知識ベース
├── skills/                # スキル定義
├── outputs/               # 成果物
└── templates/             # テンプレート
```

---

## タスク実行の流れ

### 定型タスク（高速実行）

```
ユーザー → DP → FM/CT/EX → RV
```

**例**: 「今日のファネル状況は？」「〇〇社のステータスは？」

### 非定型タスク（品質重視）

```
ユーザー → DP → FR → 各エージェント → RV
```

**例**: 「歩留まりが悪い原因を分析して」「介入戦略を立てて」

---

## ワークフロー（継続的フロー）

👉 詳細は `agents/main/WORKFLOWS.md` を参照

### 典型ワークフロー

| ID | 名前 | トリガー |
|----|------|---------|
| WF-001 | 日次レビュー | 「日次レビュー」「今日の状況」 |
| WF-002 | クライアント介入 | 「〇〇社に介入」「フォロー」 |
| WF-003 | リスクスキャン | 「リスクスキャン」「チャーン確認」 |
| WF-004 | フォローアップ実行 | 「今日のタスク」 |
| WF-005 | 週次サマリー | 「週次レビュー」 |

### ワークフロー実行例

```
ユーザー: 「日次レビューお願い」

→ DP: WF-001を認識
→ FM: ファネル分析 + 次のアクションメニュー
→ ユーザー: 「1」（Client Aを診断）
→ CT: Client A診断 + 次のアクションメニュー
→ ユーザー: 「1」（メール作成）
→ EX: メール下書き作成 + 次のアクションメニュー
→ ユーザー: 「5」（完了）
→ RV: サマリー出力
```

---

## アクションメニュー

👉 詳細は `agents/main/ACTION_MENU.md` を参照

**各エージェントの出力末尾には、必ず「次のアクション」メニューを提示する。**

```markdown
---

## 📋 次のアクション

| # | アクション | 説明 |
|---|-----------|------|
| 1 | 🔍 Client Aを詳しく診断 | ⭐ 最推奨 |
| 2 | 📧 フォローアップメール作成 | 推奨 |
| 3 | ⚠️ リスク分析 | チャーンリスク評価 |
| 4 | ✅ 完了 | ここで終了 |

→ 番号を入力:
```

ユーザーは番号を入力するだけで次のエージェントが起動し、継続的なフローが実現される。

---

## 禁止事項

- ❌ DPをスキップしてエージェントを直接起動
- ❌ Pipedriveへの無断書き込み
- ❌ ユーザー確認なしの重要判断
- ❌ アクションログなしのPipedrive操作
- ❌ 全エージェント同時起動（必要なエージェントのみ選抜）

---

## トラブルシューティング

### エージェントが正しく動作しない

1. MASTER_RULES.mdを再読み込み
2. AGENTS.mdで該当エージェントの定義を確認
3. ROUTING.mdでルーティングルールを確認

### API連携エラー

1. 環境変数を確認（PIPEDRIVE_API_TOKEN）
2. integrations/pipedrive/README.md を参照
3. APIレート制限に注意

---

## 次のステップ

1. **agents/main/MASTER_RULES.md** を読む（12のルール）
2. **agents/main/AGENTS.md** でエージェント詳細を理解
3. **agents/main/WORKFLOWS.md** でワークフローを理解
4. **agents/main/ACTION_MENU.md** でアクションメニュー形式を理解
5. 「日次レビュー」でワークフローを試してみる

---

**Client Management Agents v1.1** - Powered by Claude Code
