# SchedPoint (仮称：スケッドポイント)

## 1. アプリ概要

SchedPointは、日々の生産性向上を目的としたWebアプリケーションです。  
ユーザーが「予定」と「実際の行動」を記録し、それらを比較・客観視することで、時間の使い方を見直し行動変容を促すことを目指します。

## 2. ターゲットユーザー

* **ペルソナ:** 自己研鑽に励むビジネスマン
    - 例：30歳男性、エンジニア、都内一人暮らし、年収500万円
* **ユーザーが抱える現状の悩み:**
    - 休日や日々の業務外で自己学習の時間を確保したいが、他のことに時間を使ってしまうことがある
    - 1日の終わりに「もっと時間を有効に使えたはずだ」と後悔することがある
    - 既存のタスク管理ツールやカレンダーアプリでは、予定と実績の比較がしっくりこない
* **ユーザーがアプリに期待すること:**
    - 予定通りに行動できたか、できなかったかを客観視したい
    - 自身の行動パターンから改善点を見つけ、今後の行動改善に活かしたい

## 3. 解決したい課題

- ユーザーが時間の使い方を客観的に把握し、生産性の低い行動パターンに気づきにくい
- 従来のタスク管理ツールでは、予定と実績のシンプルな比較が不十分である

## 4. 主な機能 (MVP段階)

### 4.1. カレンダー表示機能
- 「予定」と「実績」を時間情報に基づいて並べてカレンダー上に表示する
- 1週間単位で表示する
- 将来的にレスポンシブ対応を目指している（縦長画面では3日間程度の表示）

### 4.2. 予定登録機能
- 以下の情報を登録・編集・削除できる
    - カテゴリ
    - 開始日時
    - 終了日時
    - メモ

### 4.3. 実績登録機能
- 以下の情報を登録・編集・削除できる
    - カテゴリ
    - 開始日時
    - 終了日時
    - メモ

### 4.4. その他
- **ユーザー認証機能:** MVP段階では実装しないが将来的には実装を考えている
- **カテゴリ管理機能:** MVP段階では固定リストから選択。将来的にはユーザーによるCRUD操作を可能にすることを検討している
- **データ紐付け:** MVP段階では予定と実績は紐付けせず、各データが持つ時間情報に基づいてカレンダー上に並べて表示する

## 5. 使用技術 (予定)

- **バックエンド:** Ruby on Rails (7.1.5.1)
- **フロントエンド:** (今後詳細化予定 - HTML, CSS, JavaScript)
- **データベース:** MySQL
- **Rubyバージョン:** 3.2.0
- **その他:** (今後追加予定)

## 6. 画面イメージ (スケッチベース)

- **比較表示画面:** 週間カレンダー形式で、各日に「予定」と「実績」を時間軸に沿って表示。「＋作成」ボタンを配置
- **入力フォーム画面:** カテゴリ選択、日時指定、メモ入力欄を配置

## 7. 今後の展望 (MVP以降)

- レスポンシブ対応
- ユーザー認証機能の実装
- ユーザーによるカテゴリ管理機能
- 予定遂行度合いを点数化
- 点数をグラフ表示し点数の推移を可視化する機能
- GoogleカレンダーとAPI連携し「予定」を自動入力
- 生成AIのAPIを活用しAIによる改善提案機能

## 8. 開発環境構築手順 (ローカル)

(今後、具体的な手順を記載予定)

## 9. テーブル設計

### users テーブル

| Column             | Type    | Options                   |
| ------------------ | ------- | ------------------------- |
| id                 | integer | primary_key, null: false  |
| name               | string  | null: false               |
| email              | string  | null: false, unique: true |
| encrypted_password | string  | null: false               |

#### Association

- has_many :plans
- has_many :actuals

### plans テーブル

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| id          | integer    | primary_key, null: false       |
| memo        | text       |                                |
| start_time  | datetime   | null: false                    |
| end_time    | datetime   | null: false                    |
| category_id | references | null: false, foreign_key: true(users.id) |
| user_id     | references | null: false, foreign_key: true(categories.id) |

#### Association

- belongs_to :user
- belongs_to :category

### actuals テーブル

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| id          | integer    | primary_key, null: false       |
| memo        | text       |                                |
| start_time  | datetime   | null: false                    |
| end_time    | datetime   | null: false                    |
| category_id | references | null: false, foreign_key: true(users.id) |
| user_id     | references | null: false, foreign_key: true(categories.id) |

#### Association

- belongs_to :user
- belongs_to :category

### categories テーブル

| Column             | Type    | Options                   |
| ------------------ | ------- | ------------------------- |
| id                 | integer | primary_key, null: false  |
| name               | string  | null: false, unique: true |

#### Association

- has_many :plans
- has_many :actuals
