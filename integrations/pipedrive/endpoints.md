# Pipedrive API エンドポイント一覧

## Base URL

```
https://api.pipedrive.com/v1
```

---

## 認証

すべてのリクエストに `api_token` パラメータを付与：

```
GET /deals?api_token={PIPEDRIVE_API_TOKEN}
```

---

## Deals（商談）

### 一覧取得

```
GET /deals

パラメータ:
- status: open/won/lost/deleted/all_not_deleted
- pipeline_id: パイプラインID
- stage_id: ステージID
- start: 開始位置（ページネーション）
- limit: 取得件数（最大500）
- sort: ソート（例: add_time DESC）

使用エージェント: FM, CT
```

### 詳細取得

```
GET /deals/{id}

使用エージェント: CT, EX
```

### 更新（ステージ移動等）

```
PUT /deals/{id}

ボディ:
{
  "stage_id": {NEW_STAGE_ID},
  "status": "open/won/lost"
}

使用エージェント: EX
⚠️ 確認必須
```

---

## Pipelines（パイプライン）

### 一覧取得

```
GET /pipelines

使用エージェント: FM
```

### 詳細取得

```
GET /pipelines/{id}

使用エージェント: FM
```

---

## Stages（ステージ）

### 一覧取得

```
GET /stages

パラメータ:
- pipeline_id: パイプラインIDでフィルタ

使用エージェント: FM
```

### 詳細取得

```
GET /stages/{id}

使用エージェント: FM
```

---

## Persons（担当者）

### 一覧取得

```
GET /persons

パラメータ:
- org_id: 企業IDでフィルタ
- start: 開始位置
- limit: 取得件数

使用エージェント: CT, CM
```

### 詳細取得

```
GET /persons/{id}

使用エージェント: CT, EX, CM
```

### 検索

```
GET /persons/search

パラメータ:
- term: 検索キーワード
- fields: 検索対象フィールド

使用エージェント: CT
```

---

## Organizations（企業）

### 一覧取得

```
GET /organizations

パラメータ:
- start: 開始位置
- limit: 取得件数

使用エージェント: CT
```

### 詳細取得

```
GET /organizations/{id}

使用エージェント: CT
```

---

## Activities（アクティビティ）

### 一覧取得

```
GET /activities

パラメータ:
- user_id: ユーザーIDでフィルタ
- deal_id: 商談IDでフィルタ
- person_id: 担当者IDでフィルタ
- type: アクティビティタイプ（call/meeting/task/email等）
- done: 完了フラグ（0/1）
- start_date: 開始日
- end_date: 終了日

使用エージェント: CT, CM, RP
```

### 詳細取得

```
GET /activities/{id}

使用エージェント: CT
```

### 作成

```
POST /activities

ボディ:
{
  "subject": "アクティビティ件名",
  "type": "call/meeting/task/email/deadline",
  "due_date": "2026-01-25",
  "due_time": "14:00",
  "deal_id": {DEAL_ID},
  "person_id": {PERSON_ID},
  "note": "メモ"
}

使用エージェント: EX
⚠️ 確認必須
```

---

## Notes（ノート）

### 一覧取得

```
GET /notes

パラメータ:
- deal_id: 商談IDでフィルタ
- person_id: 担当者IDでフィルタ
- org_id: 企業IDでフィルタ
- start: 開始位置
- limit: 取得件数
- sort: ソート

使用エージェント: CT, RP
```

### 詳細取得

```
GET /notes/{id}

使用エージェント: CT
```

### 作成（アクションログ記録）

```
POST /notes

ボディ:
{
  "content": "ノート内容（Markdown）",
  "deal_id": {DEAL_ID},      // いずれか1つ
  "person_id": {PERSON_ID},  // いずれか1つ
  "org_id": {ORG_ID}         // いずれか1つ
}

使用エージェント: EX
⚠️ アクションログ記録用
```

---

## Users（ユーザー）

### 現在のユーザー

```
GET /users/me

使用エージェント: 全般（認証確認）
```

### 一覧取得

```
GET /users

使用エージェント: -
```

---

## Mail Messages（メール同期）

**前提**: Pipedriveのメール同期機能が有効であること

### メール一覧取得

```
GET /mailbox/mailMessages

パラメータ:
- deal_id: 商談IDでフィルタ
- person_id: 担当者IDでフィルタ
- start: 開始位置
- limit: 取得件数

使用エージェント: CT, CM
```

### メール詳細取得

```
GET /mailbox/mailMessages/{id}

使用エージェント: CT, CM, EX
```

### メールスレッド取得

```
GET /mailbox/mailThreads/{id}

使用エージェント: CT, CM
```

---

## Activities（カレンダー同期含む）

**前提**: Pipedriveのカレンダー同期機能が有効であること

### 予定一覧取得（カレンダー）

```
GET /activities

パラメータ:
- type: meeting（MTG）, call（電話）等
- start_date: 開始日（YYYY-MM-DD）
- end_date: 終了日（YYYY-MM-DD）
- done: 0（未完了）/ 1（完了）
- user_id: ユーザーIDでフィルタ

使用エージェント: SC, CT
```

### 空き時間の確認方法

```
1. GET /activities で指定期間の予定を取得
2. done=0 でフィルタ（未完了のみ）
3. 予定のない時間帯を空きとして計算

使用エージェント: SC
```

### 予定作成（MTG設定）

```
POST /activities

ボディ:
{
  "subject": "MTGタイトル",
  "type": "meeting",
  "due_date": "2026-01-25",
  "due_time": "14:00",
  "duration": "01:00",
  "deal_id": {DEAL_ID},
  "person_id": {PERSON_ID},
  "participants": [
    {"person_id": 123}
  ],
  "note": "メモ"
}

使用エージェント: EX, SC
⚠️ 確認必須
```

---

## エージェント別使用エンドポイントまとめ

### FM: Funnel Monitor

| エンドポイント | 権限 |
|---------------|------|
| GET /deals | Read |
| GET /pipelines | Read |
| GET /stages | Read |

### CT: Client Triager

| エンドポイント | 権限 |
|---------------|------|
| GET /deals | Read |
| GET /deals/{id} | Read |
| GET /persons | Read |
| GET /persons/{id} | Read |
| GET /organizations/{id} | Read |
| GET /activities | Read |
| GET /notes | Read |
| GET /mailbox/mailMessages | Read（メール同期） |
| GET /mailbox/mailThreads/{id} | Read（メール同期） |

### RP: Risk Predictor

| エンドポイント | 権限 |
|---------------|------|
| GET /deals | Read |
| GET /activities | Read |
| GET /notes | Read |
| GET /mailbox/mailMessages | Read（メール同期） |

### EX: Executor

| エンドポイント | 権限 |
|---------------|------|
| GET /deals/{id} | Read |
| GET /persons/{id} | Read |
| PUT /deals/{id} | Write ⚠️ |
| POST /activities | Write ⚠️ |
| POST /notes | Write ⚠️ |

### CM: Communication Manager

| エンドポイント | 権限 |
|---------------|------|
| GET /persons | Read |
| GET /activities | Read |
| GET /notes | Read |
| GET /mailbox/mailMessages | Read（メール同期） |
| GET /mailbox/mailThreads/{id} | Read（メール同期） |

### SC: Scheduler

| エンドポイント | 権限 |
|---------------|------|
| GET /activities | Read（カレンダー同期） |
| POST /activities | Write ⚠️（MTG作成） |

---

## レスポンス形式

### 成功時

```json
{
  "success": true,
  "data": { ... },
  "additional_data": { ... }
}
```

### エラー時

```json
{
  "success": false,
  "error": "Error message",
  "error_info": "Additional info"
}
```

---

## ページネーション

```json
{
  "success": true,
  "data": [...],
  "additional_data": {
    "pagination": {
      "start": 0,
      "limit": 100,
      "more_items_in_collection": true,
      "next_start": 100
    }
  }
}
```

次ページ取得:

```
GET /deals?start=100&limit=100
```
