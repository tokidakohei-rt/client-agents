# クライアントステータステンプレート

## {CLIENT_NAME} ステータスレポート

**更新日**: {DATE}

---

## サマリー

| 項目 | 内容 |
|------|------|
| **企業名** | {ORG_NAME} |
| **担当者** | {PERSON_NAME} |
| **現在ステージ** | {STAGE} |
| **契約金額** | ¥{AMOUNT} |
| **ヘルススコア** | {SCORE}/100 ({LEVEL}) |
| **次回アクション** | {NEXT_ACTION} |
| **期限** | {DEADLINE} |

---

## ヘルススコア詳細

### 総合スコア: {SCORE}/100 {🟢/🟡/🔴}

| カテゴリ | スコア | 評価 |
|---------|--------|------|
| エンゲージメント | {N}/25 | {COMMENT} |
| 商談進捗 | {N}/25 | {COMMENT} |
| リスク要因 | {N}/25 | {COMMENT} |
| 拡大機会 | {N}/25 | {COMMENT} |

### スコア推移

| 日付 | スコア | 変化 |
|------|--------|------|
| {DATE_1} | {SCORE} | - |
| {DATE_2} | {SCORE} | {+/-X} |
| 今回 | {SCORE} | {+/-X} |

---

## 基本情報

### 企業情報

| 項目 | 内容 |
|------|------|
| 企業名 | {ORG_NAME} |
| 業種 | {INDUSTRY} |
| 従業員数 | {SIZE} |
| 所在地 | {LOCATION} |

### 担当者情報

| 項目 | 内容 |
|------|------|
| 氏名 | {PERSON_NAME} |
| 役職 | {TITLE} |
| メール | {EMAIL} |
| 電話 | {PHONE} |

### 商談情報

| 項目 | 内容 |
|------|------|
| 商談名 | {DEAL_TITLE} |
| 金額 | ¥{AMOUNT} |
| ステージ | {STAGE} |
| 期待成約日 | {EXPECTED_CLOSE_DATE} |
| 作成日 | {CREATED_DATE} |
| 最終更新 | {UPDATED_DATE} |

---

## アクティビティ履歴

### 直近のアクティビティ

| 日付 | 種類 | 内容 | 結果 |
|------|------|------|------|
| {DATE_1} | {TYPE} | {SUBJECT} | {OUTCOME} |
| {DATE_2} | {TYPE} | {SUBJECT} | {OUTCOME} |
| {DATE_3} | {TYPE} | {SUBJECT} | {OUTCOME} |

### コミュニケーション傾向

| 項目 | 値 |
|------|-----|
| 最終コンタクト | {DATE}（{N}日前） |
| コンタクト頻度 | {FREQUENCY} |
| 好むチャネル | {CHANNEL} |
| 平均レスポンス | {RESPONSE_TIME} |

---

## リスク・懸念事項

### 現在のリスク

| リスク | 影響度 | 詳細 |
|--------|--------|------|
| {RISK_1} | {HIGH/MEDIUM/LOW} | {DETAIL} |
| {RISK_2} | {HIGH/MEDIUM/LOW} | {DETAIL} |

### 過去の課題

| 日付 | 課題 | 解決策 | ステータス |
|------|------|--------|----------|
| {DATE} | {ISSUE} | {SOLUTION} | {RESOLVED/ONGOING} |

---

## 拡大機会

### 検出された機会

| 機会 | 可能性 | 推定金額 | 次のステップ |
|------|--------|---------|-------------|
| {OPPORTUNITY_1} | {HIGH/MEDIUM/LOW} | ¥{AMOUNT} | {ACTION} |

### 追加ニーズ

- {NEED_1}
- {NEED_2}

---

## 推奨アクション

### 即時対応（今週中）

1. **{ACTION_1}**
   - 理由: {REASON}
   - 担当: {OWNER}
   - 期限: {DEADLINE}

### 短期対応（2週間以内）

2. **{ACTION_2}**
   - 理由: {REASON}
   - 担当: {OWNER}
   - 期限: {DEADLINE}

### 中期対応（1ヶ月以内）

3. **{ACTION_3}**
   - 理由: {REASON}
   - 担当: {OWNER}
   - 期限: {DEADLINE}

---

## メモ・特記事項

{NOTES}

---

## 次回レビュー

| 項目 | 内容 |
|------|------|
| 予定日 | {NEXT_REVIEW_DATE} |
| フォーカス | {FOCUS_AREA} |

---

*レポート生成: {TIMESTAMP}*
*生成エージェント: CT (Client Triager)*
