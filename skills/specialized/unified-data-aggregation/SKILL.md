# Unified Data Aggregation Skill

## 概要
Slack、Pipedrive、Email（Pipedrive経由）の情報を統合し、クライアントの360°ビューを提供するスキル。

## データソース

| ソース | 接続方法 | 取得可能データ |
|--------|----------|---------------|
| Pipedrive | REST API | Deals, Persons, Organizations, Notes, Activities, Emails |
| Slack | MCP Server | Channels, Messages, Threads, Users |
| Email | Pipedrive同期 | Mail Messages, Threads |

## クライアント360°ビュー構築

### Step 1: クライアント識別
```
入力: クライアント名（会社名 or 担当者名）

Pipedriveで検索:
  GET /organizations?term={company_name}
  GET /persons?term={contact_name}
  
結果: organization_id, person_id, deal_ids
```

### Step 2: Pipedrive情報取得
```
# Deal情報
GET /deals?org_id={org_id}
→ ステージ、金額、期待受注日、担当者

# ノート・履歴
GET /notes?org_id={org_id}
→ 過去の記録

# アクティビティ
GET /activities?org_id={org_id}
→ 予定、完了タスク

# メール
GET /mailbox/mailMessages?deal_id={deal_id}
→ メールスレッド
```

### Step 3: Slack情報取得
```
# クライアント名で検索
slack_search_messages:
  query: "{company_name}"
  in_channel: "sales"
  after: "{7日前}"

# 関連チャンネル探索
slack_search_channels:
  query: "{company_name_short}"

# 最新スレッド取得
slack_get_thread_replies:
  channel: {channel_id}
  thread_ts: {thread_ts}
```

### Step 4: 統合ビュー生成
```yaml
client_360_view:
  basic_info:
    company: "ABC株式会社"
    contact: "田中 太郎"
    deal_stage: "Demo済み"
    deal_value: "¥1,200,000"
    expected_close: "2026-02-15"
    
  recent_activities:
    pipedrive:
      - type: "note"
        date: "2026-01-20"
        content: "見積もり送付済み"
      - type: "activity"
        date: "2026-01-22"
        content: "フォローアップコール予定"
    
    slack:
      - channel: "#sales"
        date: "2026-01-21"
        summary: "価格交渉の議論、10%値引きで合意見込み"
        thread_link: "https://slack.com/..."
    
    email:
      - date: "2026-01-19"
        subject: "Re: お見積もりについて"
        status: "replied"
  
  timeline:
    - date: "2026-01-19"
      source: "email"
      event: "見積もり送信"
    - date: "2026-01-20"
      source: "pipedrive"
      event: "ノート追加: 先方反応良好"
    - date: "2026-01-21"
      source: "slack"
      event: "社内議論: 価格交渉戦略"
    - date: "2026-01-22"
      source: "pipedrive"
      event: "フォローアップコール予定"
  
  action_items:
    pending:
      - "価格交渉の最終回答を待つ"
      - "技術質問への回答準備"
    overdue:
      - "デモ後アンケートの回収（2日経過）"
  
  health_score: 78
  risk_factors:
    - "価格交渉中（値引き要求あり）"
  positive_signals:
    - "複数回のやり取りあり"
    - "技術的質問 = 本格検討中"
```

## 日次営業ダッシュボード

### データ収集
```
1. Pipedrive: 今日のアクティビティ・ノート
   GET /activities?start_date={today}&done=0
   GET /recents?since_timestamp={today_start}

2. Slack: 営業チャンネルの今日の会話
   slack_search_messages:
     query: "*"
     in_channel: "sales"
     on: "{today}"

3. Email: 今日受信したメール
   GET /mailbox/mailMessages?filter=unread
```

### ダッシュボード出力
```yaml
daily_dashboard:
  date: "2026-01-22"
  
  pipeline_snapshot:
    total_deals: 45
    total_value: "¥54,000,000"
    stage_distribution:
      lead: 12
      appointment: 8
      opportunity: 15
      proposal: 7
      negotiation: 3
  
  today_activities:
    scheduled: 5
    completed: 3
    overdue: 2
  
  communication_summary:
    emails_received: 8
    emails_pending_reply: 3
    slack_mentions: 5
    
  attention_needed:
    - client: "ABC株式会社"
      reason: "返信待ち3日経過"
      action: "フォローアップ推奨"
    - client: "XYZ Corp"
      reason: "Slackで緊急対応依頼"
      action: "即座に確認"
  
  wins_today:
    - "DEF社 契約締結"
  
  next_actions:
    priority_1:
      - "XYZ Corp 緊急対応"
    priority_2:
      - "ABC社 フォローアップ"
      - "GHI社 提案書送付"
```

## 検索クエリパターン

### 1. クライアント関連情報の網羅的検索
```
目的: 特定クライアントの全情報を収集

Pipedrive:
  GET /organizations?term={name}
  GET /deals?org_id={org_id}
  GET /notes?org_id={org_id}
  GET /activities?org_id={org_id}
  GET /mailbox/mailMessages?deal_id={deal_id}

Slack:
  slack_search_messages:
    query: "{company_name}"
    sort: "timestamp"
    count: 50
```

### 2. 期間指定の活動履歴
```
目的: 特定期間の営業活動を振り返り

Pipedrive:
  GET /recents?since_timestamp={start}&until_timestamp={end}

Slack:
  slack_search_messages:
    after: "{start_date}"
    before: "{end_date}"
    in_channel: "sales"
```

### 3. 緊急対応が必要な案件
```
目的: 即座に対応すべき案件の特定

Pipedrive:
  GET /deals?filter_id={overdue_filter}
  GET /activities?due_date=0&done=0

Slack:
  slack_search_messages:
    query: "緊急 OR 至急 OR ASAP"
    after: "{today}"
    in_channel: "sales"
```

## 出力テンプレート

### クライアントサマリ
```markdown
# {company_name} - クライアントサマリ

## 基本情報
- 担当者: {contact_name}
- Deal Stage: {stage}
- 金額: {value}
- 期待受注日: {expected_close}

## 最新状況（過去7日）

### Pipedrive
{recent_notes_and_activities}

### Slack
{recent_slack_conversations}

### Email
{recent_email_threads}

## アクションアイテム
- [ ] {pending_action_1}
- [ ] {pending_action_2}

## リスク・注意点
- {risk_factor}

## 次のステップ
{recommended_next_step}
```

## 実行パターン

### CT（Client Tracker）エージェントが使用する場合
```
1. ユーザーからクライアント名を受け取る
2. Pipedrive APIで基本情報取得
3. Slack MCPで関連会話検索
4. Email情報をPipedrive経由で取得
5. 統合ビューを生成して出力
```

### FM（Funnel Manager）エージェントが使用する場合
```
1. 全Dealを取得
2. 各Dealに対して簡易データ収集
3. 集計・分析
4. ダッシュボード生成
```

## 注意事項
- データ取得はAPI制限に注意（特にSlack）
- 大量データの場合はページネーション使用
- キャッシュ機構は現状なし（都度取得）
- 個人情報の取り扱いに注意
