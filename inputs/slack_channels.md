# Slack Monitoring Channels

## 概要
エージェントが監視・検索対象とするSlackチャンネルの定義。

---

## 監視対象チャンネル

### 🔴 優先度: High（毎日確認）

| チャンネル名 | ID | 用途 |
|------------|-----|------|
| `omotenashi_セールスマーケ` | `C094N1P6SEA` | Omotenashi営業・マーケ |
| `omotenashi_チャット作成連携用` | `C099US3GA0Y` | チャット作成連携 |
| `pjt_omotenashi_product` | `C08RKCABZED` | Omotenashiプロダクト |
| `pjt_omotenashi_design` | `C08VCMF0GBW` | OmotenashiデザインUI/UX |
| `pjt_omotenashi_dev` | `C09082WQ17W` | Omotenashi開発 |
| `06_domestic-hotel_all` | `C087M2LL0EQ` | 国内ホテル全般 |

### 🟡 優先度: Medium（必要に応じて）

| チャンネル名 | ID | 用途 |
|------------|-----|------|
| `06_domestic-hotel_pipedrive` | `C091TNYPBEU` | Pipedrive通知 |
| `06_domestic-hotel_contact` | `C09495YCRMX` | 施設からのお問い合わせ |
| `06_domestic-hotel_request-form` | `C084FJWBNUC` | リクエストフォーム |
| `times_domestic-hotel` | `C08L1AT87UN` | チームtimes |

---

## チャンネルID一覧（コピペ用）

### High Priority
```
C094N1P6SEA  # omotenashi_セールスマーケ
C099US3GA0Y  # omotenashi_チャット作成連携用
C08RKCABZED  # pjt_omotenashi_product
C08VCMF0GBW  # pjt_omotenashi_design
C09082WQ17W  # pjt_omotenashi_dev
C087M2LL0EQ  # 06_domestic-hotel_all
```

### Medium Priority
```
C091TNYPBEU  # 06_domestic-hotel_pipedrive
C09495YCRMX  # 06_domestic-hotel_contact
C084FJWBNUC  # 06_domestic-hotel_request-form
C08L1AT87UN  # times_domestic-hotel
```

---

## 検索パターン

### 1. 日次チェック（WF-001, WF-007）
```yaml
channels:
  - C094N1P6SEA  # omotenashi_セールスマーケ
  - C087M2LL0EQ  # 06_domestic-hotel_all
period: today
```

### 2. クライアント検索（WF-002, WF-006）
```yaml
channels:
  - C094N1P6SEA  # omotenashi_セールスマーケ
  - C087M2LL0EQ  # 06_domestic-hotel_all
  - C091TNYPBEU  # 06_domestic-hotel_pipedrive
  - C09495YCRMX  # 06_domestic-hotel_contact
period: 7days
keywords: "{client_name}"
```

### 3. 緊急対応検索
```yaml
channels:
  - C094N1P6SEA  # omotenashi_セールスマーケ
  - C087M2LL0EQ  # 06_domestic-hotel_all
  - C09495YCRMX  # 06_domestic-hotel_contact
period: today
keywords:
  - "緊急"
  - "至急"
  - "対応お願い"
```

---

## 更新履歴

| 日付 | 変更内容 |
|------|---------|
| 2026-01-22 | 初期作成（omotenashi系 + domestic-hotel系） |
