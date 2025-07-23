# SchedPoint (スケッドポイント)

## 1. アプリ概要

SchedPoint は、ユーザーの時間管理能力の向上をサポートするWebアプリケーションです。  
「予定」と「実績（実際の行動）」を記録・比較し、「計画通りに進んだか」「何にどれだけ時間を使ったか」を直感的に把握することで、自身の時間感覚のズレを認識し、より現実的で精度の高いスケジュール管理ができるようになることを目指します。  

このアプリケーションは、Web系エンジニアへの転職を目指すポートフォリオとして制作されました。  

## 2. ターゲットユーザー

- **ペルソナ:** 自己研鑽に励むビジネスマン
  - 例：30歳男性、エンジニア、都内一人暮らし、年収400万円
- **ユーザーが抱える現状の悩み:**
  - 休日や日々の業務外で自己学習の時間を確保したいが、他のことに時間を使ってしまうことがある
  - 1日の終わりに「もっと時間を有効に使えたはずだ」と後悔することがある
  - 既存のカレンダーアプリでは、予定と実績の比較がしっくりこない
- **ユーザーがアプリに期待すること:**
  - 予定通りに行動できたか、できなかったかを客観視したい
  - 自身の行動パターンから改善点を見つけ、今後の行動改善に活かしたい

## 3. 解決したい課題

- ユーザーが時間の使い方を客観的に把握し、生産性の低い行動パターンに気づきにくいこと
- 既存のカレンダーアプリでは、予定と実績のシンプルな比較が不十分であること

## 4. 主な機能 (MVP段階)

### 4.1. ユーザー認証機能

- 新規ユーザー登録機能
- ログイン、ログアウト機能
- JWT（JSON Web Token）を利用した、安全なトークンベース認証
- ログイン状態の永続化（ブラウザをリロードしてもログイン状態を維持）

### 4.2. カレンダー表示機能

- ログインしているユーザーの「予定」と「実績」を時間情報に基づいて並べてカレンダー上に表示する
- 1日単位で表示する
- 日付移動のナビゲーション機能（前日へ、翌日へ）を実装する

### 4.3. 予定登録機能 (CRUD)

- ログインしているユーザー自身の予定を登録・編集・削除できる
  - カテゴリ
  - 開始日時
  - 終了日時
  - メモ

### 4.4. 実績登録機能 (CRUD)

- ログインしているユーザー自身の実績を登録・編集・削除できる
  - カテゴリ
  - 開始日時
  - 終了日時
  - メモ

### 4.5. その他

- **カテゴリ管理機能:** MVP 段階では固定リストから選択。将来的にはユーザーによる CRUD 操作を可能にすることを検討している
- **データ紐付け:** MVP 段階では予定と実績は紐付けせず、各データが持つ時間情報に基づいてカレンダー上に並べて表示する

## 5. 使用技術 (予定)

**バックエンド**
- Ruby on Rails 7.1(APIモード)
- Ruby 3.2.0
- データベース: MySQL
- 認証: Devise, Devise-JWT
- API設計:
  - RESTful API
  - バージョン管理 (/api/v1/)
  - jsonapi-serializerによる安全なJSONレスポンス生成
- テスト: PostmanによるAPIエンドポイントの動作確認

**フロントエンド**
- Vue.js 3 (Composition API)
- 状態管理: Pinia
- HTTPクライアント: Axios
- ルーティング: Vue Router
- UIフレームワーク: Tailwind CSS

## 6. 画面イメージ (スケッチベース)

- **ユーザー新規登録画面、ログイン画面**
- **比較表示画面:** 1日表示形式で、時間軸に沿って「予定」と「実績」を表示。「＋作成」ボタンや日付移動ボタンを配置
- **入力フォーム画面:** カテゴリ選択、日時指定、メモ入力欄を配置

## 7. 今後の展望 (MVP以降)

- 週間/月間カレンダー表示機能
- レスポンシブ対応（縦長画面では3日間程度の表示）
- ユーザーによるカテゴリ管理機能
- 予定遂行度合いを点数化する機能
- 点数をグラフ表示し点数の推移を可視化する機能
- Google カレンダーと API 連携し「予定」を自動入力する機能
- 生成AIのAPIを活用しAIによる行動改善提案機能

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

| Column      | Type       | Options                                       |
| ----------- | ---------- | --------------------------------------------- |
| id          | integer    | primary_key, null: false                      |
| memo        | text       |                                               |
| start_time  | datetime   | null: false                                   |
| end_time    | datetime   | null: false                                   |
| user_id     | references | null: false, foreign_key: true(users.id)      |
| category_id | references | null: false, foreign_key: true(categories.id) |

#### Association

- belongs_to :user
- belongs_to :category

### actuals テーブル

| Column      | Type       | Options                                       |
| ----------- | ---------- | --------------------------------------------- |
| id          | integer    | primary_key, null: false                      |
| memo        | text       |                                               |
| start_time  | datetime   | null: false                                   |
| end_time    | datetime   | null: false                                   |
| user_id     | references | null: false, foreign_key: true(users.id)      |
| category_id | references | null: false, foreign_key: true(categories.id) |

#### Association

- belongs_to :user
- belongs_to :category

### categories テーブル

| Column | Type    | Options                   |
| ------ | ------- | ------------------------- |
| id     | integer | primary_key, null: false  |
| name   | string  | null: false, unique: true |

#### Association

- has_many :plans
- has_many :actuals
