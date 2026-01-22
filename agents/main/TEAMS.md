# TEAMS.md - チーム定義 v1.0

## 設計原則

### ハイブリッドアプローチ

定型タスクと非定型タスクで異なるフローを採用し、効率と品質を両立。

```
定型タスク:   DP → 直接実行 → RV
非定型タスク: DP → FR → 各エージェント → RV
```

### 動的選抜

常に全員（10体）を起動するのではなく、タスクに応じて必要な2〜6体を選抜。

---

## TEAM A: Core（コア）

### 概要

| 属性 | 値 |
|------|-----|
| 役割 | タスク判定、フレーミング、品質保証 |
| メンバー | DP, FR, RV（3体） |
| 起動条件 | DP: 常に起動、FR: 非定型のみ、RV: 推奨 |

### メンバー詳細

#### DP: Dispatcher
- **役割**: タスク判定・振り分け
- **Skills**: `task-classification`
- **起動**: **常に最初（例外なし）**
- **特殊能力**: 定型/非定型の判定、エージェント選抜

#### FR: Framer
- **役割**: 非定型タスクの目的・評価軸明確化
- **Skills**: `task-framing`, `requirement-analysis`
- **起動**: DPが「非定型」と判定した場合のみ
- **特殊能力**: 逆質問、曖昧さの解消

#### RV: Reviewer
- **役割**: 品質レビュー、GO/NO-GO判定
- **Skills**: `quality-review`, `risk-assessment`
- **起動**: 重要タスクで最後（推奨）
- **特殊能力**: **GO/NO-GO判定**、差し戻し指示

---

## TEAM B: Analysis（分析）

### 概要

| 属性 | 値 |
|------|-----|
| 役割 | ファネル分析・戦略評価 |
| メンバー | FM, SA（2体） |
| 起動条件 | ファネル・パイプライン関連タスク、戦略レビュー |

### メンバー詳細

#### FM: Funnel Monitor
- **役割**: ファネル全体の状況確認・分析・歩留まり特定
- **Skills**: `funnel-analysis`, `pipedrive-integration`, `data-visualization`
- **起動キーワード**: ファネル、歩留まり、CVR、パイプライン、ボトルネック
- **連携API**: Pipedrive（Read: deals, pipelines, stages）

#### SA: Strategy Advisor 🆕
- **役割**: SaaS営業戦略・戦術の俯瞰的評価、軌道修正提案
- **Skills**: `saas-sales-strategy`, `tactical-planning`, `growth-metrics`
- **起動キーワード**: 戦略、戦術、方針、軌道修正、振り返り
- **自動起動**: 週次サマリー（WF-005）、ファネル異常検出時、大型案件
- **特殊能力**: **クリティカルな指摘**、忖度しない評価

---

## TEAM C: Client Intelligence（クライアント診断）

### 概要

| 属性 | 値 |
|------|-----|
| 役割 | 個別クライアントの診断・リスク予測 |
| メンバー | CT, RP（2体） |
| 起動条件 | クライアント個別の分析・リスク評価 |

### メンバー詳細

#### CT: Client Triager
- **役割**: 個別クライアントのステータスチェック、アクション整理
- **Skills**: `client-health-scoring`, `pipedrive-integration`, `action-planning`
- **起動キーワード**: クライアント、顧客、ステータス、状況確認、ヘルス
- **連携API**: Pipedrive（Read: persons, organizations, deals, activities, notes）

#### RP: Risk Predictor
- **役割**: チャーンリスク予測、早期警告
- **Skills**: `risk-prediction`, `pipedrive-integration`, `pattern-analysis`
- **起動キーワード**: リスク、チャーン、解約、警告、危険
- **連携API**: Pipedrive（Read: deals, activities, notes）

---

## TEAM D: Execution（実行）

### 概要

| 属性 | 値 |
|------|-----|
| 役割 | アクション実行、コミュニケーション、日程調整 |
| メンバー | EX, CM, SC（3体） |
| 起動条件 | 具体的なアクション実行が必要な場合 |

### メンバー詳細

#### EX: Executor
- **役割**: アクション実行支援、Pipedrive操作
- **Skills**: `email-drafting`, `pipedrive-integration`, `action-logging`
- **起動キーワード**: メール作成、フォローアップ、アクション、更新
- **連携API**: Pipedrive（Read: all, Write: deals, activities, notes）
- **特殊能力**: **Pipedriveへの書き込み**（確認必須）

#### CM: Communication Manager
- **役割**: コミュニケーション最適化、タイミング・チャネル提案
- **Skills**: `communication-optimization`, `pipedrive-integration`
- **起動キーワード**: コミュニケーション、連絡、アプローチ、タイミング
- **連携API**: Pipedrive（Read: activities, notes, persons）

#### SC: Scheduler
- **役割**: 日程調整、空き時間確認、MTG候補提案
- **Skills**: `calendar-integration`, `scheduling-optimization`
- **起動キーワード**: 日程調整、MTG、アポ、空き確認、スケジュール
- **連携API**: Google Calendar（Read: freebusy, events）

---

## チーム起動パターン

### パターン1: 最小構成（2体）

```
DP → FM → (終了)
```
**使用場面**: シンプルなファネル確認（レビュー不要）

**例**:
- 「今日のファネル状況は？」

### パターン2: 定型タスク標準（3体）

```
DP → CT/EX/SC → RV
```
**使用場面**: 定型的なクライアント確認、アクション実行

**例**:
- 「〇〇社のステータスは？」
- 「フォローアップメールを作成して」
- 「来週の空き時間を確認して」

### パターン3: 非定型タスク標準（4-5体）

```
DP → FR → FM/CT → EX → RV
```
**使用場面**: 分析を伴うアクション

**例**:
- 「歩留まりが悪い原因を分析して対策を立てて」
- 「〇〇社への最適なアプローチを検討して」

### パターン4: リスク対応（5-6体）

```
DP → FR → CT + RP → EX + CM → RV
```
**使用場面**: リスククライアントへの介入計画

**例**:
- 「チャーンリスクの高い顧客を特定して介入計画を立てて」

### パターン5: フル診断（6-7体）

```
DP → FR → FM → CT + RP → EX + SC → RV
```
**使用場面**: 包括的な分析とアクション計画

**例**:
- 「今月のパイプライン全体を分析して、各クライアントへのアクション計画を立てて」

---

## チーム間連携

### 標準フロー

```
TEAM A (DP) → TEAM B/C (分析) → TEAM D (実行) → TEAM A (RV)
```

### 非定型タスクフロー

```
TEAM A (DP) → TEAM A (FR) → TEAM B/C → TEAM D → TEAM A (RV)
```

### 並列実行可能なケース

```
DP → [CT + RP]（並列）→ EX → RV
DP → FR → [FM + CT]（並列）→ EX → RV
```

---

## 選抜ロジック

### キーワードマッチング

| キーワード | 起動候補 | 優先度 |
|-----------|---------|-------|
| ファネル、パイプライン、CVR | FM | 高 |
| 戦略、戦術、方針、軌道修正 | SA | 高 |
| クライアント、顧客、ステータス | CT | 高 |
| リスク、チャーン、解約 | RP | 高 |
| メール、フォローアップ、アクション | EX | 高 |
| コミュニケーション、タイミング | CM | 中 |
| 日程、MTG、アポ | SC | 高 |

### 定型/非定型の判定基準

#### 定型タスク（FRスキップ）
- 単純な情報取得（「〜の状況は？」）
- 定型フォーマットの出力（日次レポート等）
- 明確な指示のアクション（「メールを作成して」）

#### 非定型タスク（FR経由）
- 分析・原因究明（「なぜ〜か？」）
- 戦略・計画立案（「〜を検討して」）
- 複数要素の比較・判断（「最適な〜は？」）

---

## 動的選抜の目安

| タスク複雑度 | 起動体数 | 構成 |
|-------------|---------|------|
| シンプル | 2体 | DP + 1体 |
| 定型 | 3体 | DP + 1体 + RV |
| 標準 | 4-5体 | DP + FR + 2体 + RV |
| 複雑 | 6-7体 | DP + FR + 3-4体 + RV |

---

## まとめ

| チーム | メンバー | 役割 | 起動条件 |
|--------|---------|------|----------|
| **TEAM A: Core** | DP, FR, RV | 判定・フレーミング・レビュー | DP常に、FR非定型のみ、RV推奨 |
| **TEAM B: Analysis** | FM, SA | ファネル分析・戦略評価 | ファネル関連、戦略レビュー |
| **TEAM C: Intelligence** | CT, RP | クライアント診断・リスク予測 | クライアント関連 |
| **TEAM D: Execution** | EX, CM, SC | アクション実行・日程調整 | 実行が必要な場合 |
