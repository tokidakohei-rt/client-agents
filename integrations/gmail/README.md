# Gmail API 連携ガイド

## 概要

Client Management AgentsはGmail APIと連携し、クライアントとのメールコミュニケーションの検索・分析・下書き作成を行います。

**権限**: Read + Write（下書き作成）

---

## 認証設定

### 1. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Calendar連携で作成したプロジェクトを選択（または新規作成）
3. **APIとサービス** → **ライブラリ**
4. **Gmail API** を検索して有効化

### 2. OAuth 2.0認証情報

Calendar連携と同じ認証情報を使用可能。スコープを追加：

```
# 必要なスコープ
https://www.googleapis.com/auth/gmail.readonly    # メール読み取り
https://www.googleapis.com/auth/gmail.compose     # 下書き作成
```

### 3. 初回認証

初回実行時にブラウザが開き、追加のスコープ承認を求められます。

---

## 使用エンドポイント

### Read（読み取り）

| エンドポイント | 用途 | 使用エージェント |
|---------------|------|-----------------|
| `GET /messages` | メール一覧取得 | CT, CM |
| `GET /messages/{id}` | メール詳細取得 | CT, CM, EX |
| `GET /threads/{id}` | スレッド取得 | CT, CM |
| `GET /labels` | ラベル一覧取得 | CT |

### Write（書き込み）

| エンドポイント | 用途 | 使用エージェント |
|---------------|------|-----------------|
| `POST /drafts` | 下書き作成 | EX |
| `PUT /drafts/{id}` | 下書き更新 | EX |
| `DELETE /drafts/{id}` | 下書き削除 | EX |

---

## 使用スコープ

```
# Read
https://www.googleapis.com/auth/gmail.readonly

# Write（下書きのみ）
https://www.googleapis.com/auth/gmail.compose
```

**注意**: `gmail.compose` は下書き作成のみ。自動送信は行わない（送信は人間が確認後に行う）。

---

## 検索クエリ

### 基本検索

```
# 特定の送信者から
from:client@example.com

# 特定の宛先へ
to:client@example.com

# 件名に含む
subject:提案書

# 期間指定
after:2026/01/01 before:2026/01/31

# 未読のみ
is:unread

# スター付き
is:starred

# 添付ファイルあり
has:attachment
```

### 複合検索

```
# クライアントからの未読メール
from:client@example.com is:unread

# 過去7日間のやり取り
(from:client@example.com OR to:client@example.com) after:2026/01/13

# 提案関連の未返信
subject:提案 is:unread -in:sent
```

### クライアント検索の例

```python
# 特定クライアントとの全やり取り
query = f"(from:{client_email} OR to:{client_email})"

# 未返信検出（相手からのメールで、送信済みに返信がない）
query = f"from:{client_email} is:unread"

# 過去30日のやり取り
query = f"(from:{client_email} OR to:{client_email}) newer_than:30d"
```

---

## データモデル

### Message（メール）

```json
{
  "id": "message123",
  "threadId": "thread456",
  "labelIds": ["INBOX", "UNREAD"],
  "snippet": "メール本文の冒頭...",
  "payload": {
    "headers": [
      {"name": "From", "value": "sender@example.com"},
      {"name": "To", "value": "recipient@example.com"},
      {"name": "Subject", "value": "件名"},
      {"name": "Date", "value": "Mon, 20 Jan 2026 10:00:00 +0900"}
    ],
    "body": {
      "data": "base64エンコードされた本文"
    }
  },
  "internalDate": "1737338400000"
}
```

### Thread（スレッド）

```json
{
  "id": "thread456",
  "historyId": "12345",
  "messages": [
    { "id": "message1", ... },
    { "id": "message2", ... }
  ]
}
```

### Draft（下書き）

```json
{
  "id": "draft789",
  "message": {
    "raw": "base64エンコードされたRFC2822形式のメール"
  }
}
```

---

## エージェント別使用方法

### CT: Client Triager

```
用途: クライアントとのコミュニケーション履歴確認

検索例:
- 特定クライアントとの全やり取り
- 最終コンタクト日の特定
- 未返信メールの検出

出力:
- 直近のメールやり取りサマリー
- コミュニケーション頻度
- 未対応メールの有無
```

### CM: Communication Manager

```
用途: コミュニケーションパターン分析

分析項目:
- メール頻度の推移
- 返信速度（相手・自社）
- やり取りのトーン
- 話題の傾向

出力:
- コミュニケーション傾向レポート
- 最適なアプローチ提案
```

### EX: Executor

```
用途: メール下書き作成

機能:
- 返信メールの下書き作成
- 新規メールの下書き作成
- テンプレートベースの下書き

⚠️ 確認必須:
- 下書き作成前に内容を確認
- 送信は人間が手動で行う
```

---

## 下書き作成フロー

### 1. コンテキスト収集

```
1. Pipedriveからクライアント情報取得
2. Gmailから過去のやり取り取得
3. コミュニケーション傾向を分析
```

### 2. 下書き作成

```
1. email-draftingスキルでメール本文作成
2. パーソナライズ適用
3. 下書きとして保存
```

### 3. 確認・送信

```
1. ユーザーに下書き内容を表示
2. 修正があれば反映
3. ユーザーがGmailで確認・送信
```

### 確認フォーマット

```markdown
## ✉️ 下書き作成完了

### 宛先
- To: {EMAIL}
- Cc: {CC}（該当する場合）

### 件名
{SUBJECT}

### 本文プレビュー
---
{EMAIL_BODY}
---

### 下書きリンク
[Gmailで確認・編集する]({DRAFT_LINK})

⚠️ 送信前に内容をご確認ください。
```

---

## 未返信メール検出ロジック

### 検出条件

```
1. 相手から受信したメール
2. そのスレッドに自分の返信がない
3. 受信から一定期間経過（例: 3日）
```

### 実装例

```python
# 1. クライアントからのメール取得
messages = gmail.messages().list(
    userId='me',
    q=f'from:{client_email} newer_than:7d'
).execute()

# 2. 各スレッドをチェック
for msg in messages:
    thread = gmail.threads().get(
        userId='me',
        id=msg['threadId']
    ).execute()
    
    # 3. 自分の返信があるかチェック
    has_reply = any(
        'me' in m['from'] 
        for m in thread['messages']
    )
    
    if not has_reply:
        # 未返信として報告
        ...
```

---

## セキュリティ

### 必須事項

- OAuth認証情報は安全に保管
- トークンは環境変数または安全なストレージで管理
- 下書き作成前に必ずユーザー確認
- **自動送信は絶対に行わない**

### 推奨事項

- 最小限のスコープのみ使用
- 定期的なトークン更新
- アクセスログの保持

---

## エラーハンドリング

| エラー | 意味 | 対応 |
|--------|------|------|
| 401 | 認証エラー | トークン再取得 |
| 403 | 権限不足 | スコープ確認 |
| 404 | メール/下書き不存在 | ID確認 |
| 429 | レート制限 | リトライ |

---

## レート制限

| 項目 | 制限 |
|------|------|
| クエリ/日 | 1,000,000,000（プロジェクト） |
| クエリ/ユーザー/秒 | 250 |

通常の使用では問題にならない制限です。

---

## 参考リンク

- [Gmail API Documentation](https://developers.google.com/gmail/api/reference/rest)
- [Gmail API Guides](https://developers.google.com/gmail/api/guides)
- [Search Operators](https://support.google.com/mail/answer/7190)
