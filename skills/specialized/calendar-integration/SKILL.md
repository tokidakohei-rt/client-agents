---
name: calendar-integration
type: specialized
description: Google Calendarとの連携、空き時間確認、日程調整
used_by: [SC]
---

# calendar-integration

## Overview

Google Calendar APIと連携し、空き時間の確認と日程調整を行うスキル。

---

## Capabilities

### 1. 空き時間確認

```
入力: 期間、カレンダーID
出力: 空き時間リスト
```

### 2. 候補日時生成

```
入力: 空き時間、スケジューリングルール
出力: 推奨候補日時（3-5個）
```

### 3. 重複チェック

```
入力: 候補日時、既存予定
出力: 重複有無
```

---

## API Endpoints

| エンドポイント | 用途 | 権限 |
|---------------|------|------|
| GET /freeBusy | 空き状況確認 | Read |
| GET /events | 予定一覧取得 | Read |
| GET /calendars/{id} | カレンダー情報 | Read |

**注意**: Write権限は使用しない（Read Only）

---

## Scheduling Rules

### 営業時間

```yaml
weekdays: [Monday, Tuesday, Wednesday, Thursday, Friday]
hours: 09:00 - 18:00
timezone: Asia/Tokyo
```

### バッファ時間

```yaml
before_meeting: 15min
after_meeting: 15min
between_meetings: 30min（推奨）
```

### 避けるべき時間帯

```yaml
avoid:
  - Monday 09:00-10:00（週初め）
  - Friday 17:00-18:00（週末前）
  - 12:00-13:00（昼休み）
```

### 優先時間帯

```yaml
prefer:
  - 10:00-12:00（午前）
  - 14:00-17:00（午後）
```

---

## Output Format

```markdown
## 日程調整: {PURPOSE}

### 確認期間
{START_DATE} 〜 {END_DATE}

### 空き時間サマリー
- 確認可能な空き枠: {N}件
- 推奨時間帯: {N}件

### 候補日時（推奨順）

1. **{DATE_TIME_1}** ⭐ 最推奨
   - 空き: {DURATION}
   - 理由: {REASON}

2. **{DATE_TIME_2}**
   - 空き: {DURATION}
   - 理由: {REASON}

3. **{DATE_TIME_3}**
   - 空き: {DURATION}
   - 理由: {REASON}

### 注意事項
- {NOTE_1}
- {NOTE_2}

### 提案メッセージ例

```
{SUGGESTED_MESSAGE}
```
```

---

## Candidate Generation Logic

### Step 1: 空き時間取得

```
1. FreeBusy APIで指定期間のbusy時間を取得
2. 営業時間内の空き時間を計算
```

### Step 2: フィルタリング

```
1. 必要な時間枠（MTG時間 + バッファ）を確保できる空きを抽出
2. 避けるべき時間帯を除外
```

### Step 3: スコアリング

```
1. 優先時間帯 → +10点
2. 週中（火〜木）→ +5点
3. 前後の予定との間隔 → +5点（30分以上）
4. 午後 → +3点
```

### Step 4: 候補選定

```
1. スコア順にソート
2. 上位3-5件を候補として提示
```

---

## Error Handling

| エラー | 対応 |
|--------|------|
| 認証エラー | トークン再取得 |
| カレンダー不存在 | カレンダーID確認 |
| 空きなし | 期間拡大を提案 |

---

## Best Practices

### DO ✅

- ✅ 複数の候補を提示（3-5個）
- ✅ 推奨理由を明示
- ✅ バッファ時間を考慮
- ✅ 相手の希望を優先

### DON'T ❌

- ❌ 単一候補のみ提示
- ❌ 理由なしの候補
- ❌ 連続MTGの設定
- ❌ 営業時間外の提案
