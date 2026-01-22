---
name: gmail-integration
type: specialized
description: Gmail APIとの連携、メール検索・分析・下書き作成
used_by: [CT, CM, EX]
---

# gmail-integration

## Overview

Gmail APIと連携し、クライアントとのメールコミュニケーションの検索・分析・下書き作成を行うスキル。

---

## Capabilities

### Read（読み取り）

| 機能 | 用途 | 使用エージェント |
|------|------|-----------------|
| メール検索 | クライアントとのやり取り取得 | CT, CM |
| メール詳細取得 | 本文・添付ファイル確認 | CT, CM, EX |
| スレッド取得 | 会話の流れ把握 | CT, CM |
| 未返信検出 | フォローアップ必要なメール特定 | CT |

### Write（書き込み）

| 機能 | 用途 | 使用エージェント |
|------|------|-----------------|
| 下書き作成 | メール下書き保存 | EX |
| 下書き更新 | 既存下書きの修正 | EX |

**注意**: 送信は行わない。下書きまで。

---

## 検索クエリリファレンス

### 基本演算子

| 演算子 | 説明 | 例 |
|--------|------|-----|
| `from:` | 送信者 | `from:client@example.com` |
| `to:` | 宛先 | `to:client@example.com` |
| `subject:` | 件名 | `subject:提案書` |
| `after:` | 以降 | `after:2026/01/01` |
| `before:` | 以前 | `before:2026/01/31` |
| `newer_than:` | 直近N日 | `newer_than:7d` |
| `older_than:` | N日以上前 | `older_than:30d` |
| `is:unread` | 未読 | `is:unread` |
| `is:starred` | スター付き | `is:starred` |
| `has:attachment` | 添付あり | `has:attachment` |
| `in:sent` | 送信済み | `in:sent` |
| `in:inbox` | 受信トレイ | `in:inbox` |

### よく使う検索パターン

```yaml
# クライアントとの全やり取り
client_all: "(from:{email} OR to:{email})"

# 過去7日間のやり取り
client_recent: "(from:{email} OR to:{email}) newer_than:7d"

# 未読メール（クライアントから）
client_unread: "from:{email} is:unread"

# 未返信検出（受信したが返信していない）
unreplied: "from:{email} is:unread -in:sent"

# 重要なメール（スター付きまたは添付あり）
important: "(from:{email} OR to:{email}) (is:starred OR has:attachment)"
```

---

## エージェント別使用方法

### CT: Client Triager

**目的**: コミュニケーション履歴の確認、未返信検出

```yaml
inputs:
  - client_email: クライアントのメールアドレス
  - period: 検索期間（デフォルト: 30日）

outputs:
  - recent_emails: 直近のメールリスト
  - last_contact_date: 最終コンタクト日
  - unreplied_emails: 未返信メールリスト
  - communication_summary: やり取りサマリー
```

**出力フォーマット**:

```markdown
## メールコミュニケーション: {CLIENT_NAME}

### 直近のやり取り
| 日付 | 方向 | 件名 | ステータス |
|------|------|------|----------|
| {DATE} | 受信 | {SUBJECT} | {READ/UNREAD} |
| {DATE} | 送信 | {SUBJECT} | - |

### サマリー
- 最終コンタクト: {DATE}（{N}日前）
- 過去30日のやり取り: {N}件
- 未返信メール: {N}件

### ⚠️ 要対応
- {UNREPLIED_EMAIL_1}（{N}日前受信）
- {UNREPLIED_EMAIL_2}（{N}日前受信）
```

### CM: Communication Manager

**目的**: コミュニケーションパターン分析

```yaml
inputs:
  - client_email: クライアントのメールアドレス
  - period: 分析期間（デフォルト: 90日）

outputs:
  - frequency: メール頻度
  - response_time: 平均返信時間
  - tone_analysis: トーン分析
  - topic_trends: 話題の傾向
```

**出力フォーマット**:

```markdown
## コミュニケーション分析: {CLIENT_NAME}

### 頻度
- 平均: {N}通/週
- 最近の傾向: {増加/減少/安定}

### 返信速度
- 相手の平均返信: {N}時間
- 自社の平均返信: {N}時間

### トーン
- 全体的な印象: {ポジティブ/ニュートラル/注意}
- キーワード: {頻出キーワード}

### 推奨アプローチ
- {RECOMMENDATION}
```

### EX: Executor

**目的**: メール下書き作成

```yaml
inputs:
  - client_email: 宛先
  - email_type: メール種類（followup/proposal/reminder等）
  - context: Pipedriveからの情報
  - thread_id: 返信の場合、元スレッドID（オプション）

outputs:
  - draft_id: 作成した下書きのID
  - draft_link: Gmailで開くリンク
  - preview: プレビュー
```

**確認フォーマット**:

```markdown
## ✉️ 下書き作成確認

### 宛先
- To: {EMAIL}
- Cc: {CC}

### 件名
{SUBJECT}

### 本文
---
{EMAIL_BODY}
---

### オプション
- [ ] 返信として作成（Re: {ORIGINAL_SUBJECT}）
- [ ] 添付ファイルあり

→ この内容で下書きを作成しますか？
```

---

## 下書き作成ワークフロー

### Step 1: コンテキスト収集

```
1. Pipedriveからクライアント情報取得
   - 担当者名、企業名
   - 現在のステージ
   - 直近のアクティビティ

2. Gmailから過去のやり取り取得
   - 直近のメール内容
   - やり取りのトーン
   - 未解決の話題

3. 情報を統合
```

### Step 2: メール作成

```
1. email-draftingスキルで本文作成
   - テンプレート選択
   - パーソナライズ適用
   - トーン調整

2. 確認プロンプト表示
```

### Step 3: 下書き保存

```
1. ユーザー承認を待つ
2. Gmail API で下書き作成
3. 下書きリンクを返す
```

### Step 4: 送信（ユーザー）

```
1. ユーザーがGmailで下書きを開く
2. 内容を確認・編集
3. ユーザーが送信ボタンをクリック

⚠️ エージェントは送信しない
```

---

## 未返信検出ロジック

### 検出基準

| 条件 | 判定 |
|------|------|
| 相手からのメール | 必須 |
| 未読 | 高優先度 |
| 3日以上経過 | 要フォロー |
| 7日以上経過 | 緊急 |

### アラートレベル

```yaml
urgent:  # 赤
  - 7日以上未返信
  - 重要顧客からの未読

warning:  # 黄
  - 3-7日未返信
  - 質問形式のメール

info:  # 青
  - 3日未満
  - 情報共有系メール
```

---

## エラーハンドリング

| エラー | 対応 |
|--------|------|
| 認証エラー | トークン再取得 |
| メール見つからず | 検索条件確認 |
| 下書き作成失敗 | 内容確認、リトライ |
| レート制限 | 待機後リトライ |

---

## Best Practices

### DO ✅

- ✅ 必要最小限のメールのみ取得
- ✅ 下書き作成前に必ず確認
- ✅ 過去のやり取りを参照してパーソナライズ
- ✅ トーンを相手に合わせる

### DON'T ❌

- ❌ 自動送信（絶対禁止）
- ❌ 大量のメール一括取得
- ❌ 機密情報のログ記録
- ❌ 確認なしの下書き作成
