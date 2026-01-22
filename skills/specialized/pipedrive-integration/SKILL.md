---
name: pipedrive-integration
type: specialized
description: Pipedrive CRMとのAPI連携
used_by: [FM, CT, RP, EX, CM]
---

# pipedrive-integration

## Overview

Pipedrive CRMとAPI連携し、クライアントデータの取得・更新を行うスキル。

---

## Capabilities

### Read（読み取り）

| 機能 | エンドポイント | 使用エージェント |
|------|---------------|-----------------|
| 商談一覧取得 | GET /deals | FM, CT |
| 商談詳細取得 | GET /deals/{id} | CT, EX |
| パイプライン取得 | GET /pipelines | FM |
| ステージ取得 | GET /stages | FM |
| 担当者取得 | GET /persons | CT, CM |
| 企業取得 | GET /organizations | CT |
| アクティビティ取得 | GET /activities | CT, CM, RP |
| ノート取得 | GET /notes | CT, RP |

### Write（書き込み）- 確認必須

| 機能 | エンドポイント | 使用エージェント |
|------|---------------|-----------------|
| 商談更新 | PUT /deals/{id} | EX |
| アクティビティ作成 | POST /activities | EX |
| ノート追加 | POST /notes | EX |

---

## Usage Rules

### 1. 認証

```
環境変数: PIPEDRIVE_API_TOKEN
ベースURL: https://api.pipedrive.com/v1
```

### 2. 書き込み前の確認

書き込み操作を行う前に、必ずユーザーに確認する。

```markdown
## ⚠️ Pipedrive 操作確認

| 項目 | 内容 |
|------|------|
| **対象** | [対象名] |
| **操作** | [操作内容] |
| **変更前** | [現在値] |
| **変更後** | [変更後の値] |

→ 実行してよろしいですか？
```

### 3. アクションログ記録

重要な操作はノートとして記録する。
フォーマット: `integrations/pipedrive/action-log-schema.md` を参照

---

## Data Models

### Deal（商談）

```yaml
id: number
title: string
value: number
currency: string
stage_id: number
pipeline_id: number
person_id: number
org_id: number
status: open/won/lost
expected_close_date: date
```

### Person（担当者）

```yaml
id: number
name: string
email: array
phone: array
org_id: number
```

### Activity（アクティビティ）

```yaml
id: number
type: call/meeting/task/email
subject: string
due_date: date
due_time: time
done: boolean
deal_id: number
person_id: number
```

---

## Error Handling

| ステータス | 対応 |
|-----------|------|
| 401 | APIトークン確認 |
| 403 | 権限確認 |
| 404 | ID確認 |
| 429 | リトライ（バックオフ） |

---

## Best Practices

### DO ✅

- ✅ 最小限のデータのみ取得
- ✅ 書き込み前に必ず確認
- ✅ アクションログを記録
- ✅ エラーハンドリングを適切に

### DON'T ❌

- ❌ 無断で書き込み操作
- ❌ 大量データの一括取得（ページネーション使用）
- ❌ 機密情報のログ記録
