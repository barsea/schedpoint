# SchedPoint プロジェクトサマリー

### 1. アプリケーションの概要

`SchedPoint`は、日々の「予定」と「実績」を時間軸上で可視化し、比較・分析することで、ユーザーの時間管理能力の向上をサポートする Web アプリケーションです。

**主要な機能:**

- **ユーザー認証**: 新規登録、ログイン、ログアウト機能。
- **予定・実績の CRUD 管理**: カレンダー形式の UI で、日々の予定と、実際に行動した実績を記録・閲覧・更新・削除する機能。
- **カテゴリ管理**: 予定や実績を分類するためのカテゴリ機能。

### 2. 技術スタック

モダンな Web 開発で標準的な、バックエンドとフロントエンドを完全に分離した**SPA（シングルページアプリケーション）**構成を採用しています。

#### バックエンド

- **Ruby**: `3.2.0`
- **Rails**: `7.1.5` (API モード)
- **データベース**: MySQL (開発), PostgreSQL (本番)
- **主要な Gem**:
  - `devise`, `devise-jwt`: トークンベースの API 認証
  - `rspec-rails`: テストフレームワーク
  - `rack-cors`: CORS 設定
  - `jsonapi-serializer`: JSON レスポンス生成
  - `puma`: Web サーバー
  - `rubocop`, `rubocop-rails`: 静的コード解析・フォーマッター

#### フロントエンド

- **フレームワーク**: Vue.js 3 (Composition API)
- **状態管理**: Pinia
- **HTTP クライアント**: Axios
- **ルーティング**: Vue Router
- **UI/スタイリング**: Tailwind CSS, Font Awesome

#### インフラ・開発環境

- **デプロイ**: Render (Web Service / Static Site)
- **コード品質**: RuboCop, Prettier
- **テスト**: Postman (API エンドポイントテスト), 手動総合テスト
- **実行環境**: foreman

### 3. データベーススキーマ

```ruby
ActiveRecord::Schema[7.1].define(version: 2025_07_25_120000) do
  create_table "actuals", charset: "utf8mb3", force: :cascade do |t|
    t.text "memo"
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.bigint "user_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_actuals_on_category_id"
    t.index ["user_id"], name: "index_actuals_on_user_id"
  end

  create_table "categories", charset: "utf8mb3", force: :cascade do |t|
    t.string "name", null: false
    t.string "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "plans", charset: "utf8mb3", force: :cascade do |t|
    t.text "memo"
    t.datetime "start_time", null: false
    t.datetime "end_time", null: false
    t.bigint "user_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_plans_on_category_id"
    t.index ["user_id"], name: "index_plans_on_user_id"
  end

  create_table "users", charset: "utf8mb3", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "actuals", "categories"
  add_foreign_key "actuals", "users"
  add_foreign_key "plans", "categories"
  add_foreign_key "plans", "users"
end
```

### 4. 主要なモデルのコード

**`user.rb`**

```ruby
# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :validatable,
          :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :plans, dependent: :destroy
  has_many :actuals, dependent: :destroy

  validates :name, presence: true

  before_create :set_jti

  private

  def set_jti
    self.jti ||= SecureRandom.uuid
  end
end
```

**`plan.rb` / `actual.rb`**

```ruby
# frozen_string_literal: true

class Plan < ApplicationRecord # または Actual
  belongs_to :user
  belongs_to :category

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :memo, length: { maximum: 100 }
  validate :start_time_cannot_be_after_end_time

  private

  def start_time_cannot_be_after_end_time
    return if start_time.blank? || end_time.blank?
    if start_time > end_time
      errors.add(:start_time, "は終了時刻より前に設定してください")
    end
  end
end
```

**`category.rb`**

```ruby
class Category < ApplicationRecord
  has_many :plans, dependent: :destroy
  has_many :actuals, dependent: :destroy
end
```

### 5. ルーティング (config/routes.rb)

```ruby
Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  namespace :api do
    namespace :v1 do
      resources :plans, only: [:index, :create, :show, :update, :destroy]
      resources :actuals, only: [:index, :create, :show, :update, :destroy]
      resources :categories, only: [:index]
    end
  end
end
```

### 6. 重要な決定事項

- **アーキテクチャ**: Rails を API モード、フロントエンドを Vue.js による SPA とする構成。
- **UI/UX**:
  - 1 日単位でのカレンダー表示。
  - 予定・実績の作成は、共通化されたフォームコンポーネントを使用。
  - 更新・削除は、画面遷移を伴わないモーダルウィンドウで実行。
  - 「+作成」ボタンは、「予定」「実績」を選択できるドロップダウンメニューとして実装。
- **認証**: `devise-jwt`を利用したステートレスな JWT 認証。
- **API 設計**:
  - 将来の拡張性を考慮し、`api/v1/`のように**バージョンを明記した RESTful API**として設計。
  - コア機能は`EventsController`で一つにまとめるのではなく、責務を明確にするため`PlansController`と`ActualsController`に分割。
  - **API レスポンスの統一**: `jsonapi-serializer`を全面的に採用し、すべての API エンドポイントで構造化された JSON を返すように設計。これによりフロントエンドでのデータハンドリングを簡素化し、保守性を向上。
- **データ品質**:
  - バックエンドのモデル層で、時間の前後関係や文字数などのバリデーションを実装。
  - Rails の i18n 機能を導入し、エラーメッセージを日本語に統一。
- **タイムゾーン**: バックエンドは UTC、フロントエンドは JST で管理。
- **テスト**: Postman による API の動作確認と、ブラウザでの手動総合テストを実施。テストフレームワークとして**RSpec**を導入済み。
- **コード品質**: `RuboCop`と`Prettier`を導入し、保存時の自動整形を設定することで、コードの品質と一貫性を担保。
- **デプロイ**:
  - ホスティングサービスとして**Render**を選定。
  - バックエンド(Web Service)とフロントエンド(Static Site)を分離してデプロイ。
  - 本番環境のデータベースには**PostgreSQL**を使用。
  - 機密情報は**環境変数**で安全に管理。

### 7. 開発の記録と今後のタスク

#### 完了したタスク (MVP)

- **【完了】** ユーザー認証機能 (CRUD)
- **【完了】** 「予定」管理機能 (CRUD)
- **【完了】** 「実績」管理機能 (CRUD)
- **【完了】** 日付またぎ表示の修正
- **【完了】** バックエンドのバリデーション強化
- **【完了】** 本番環境へのデプロイ

#### 今後のタスク (MVP 以降)

- レスポンシブ対応
- 予定遂行度合いを点数化する機能
- 点数をグラフ表示し点数の推移を可視化する機能
- 週間/月間カレンダー表示機能
- ユーザーによるカテゴリ管理機能
- 予定と実績の時間帯重複チェック機能
- Google カレンダーと API 連携し「予定」を自動入力する機能
- 生成 AI の API を活用し AI による行動改善提案機能

### 8. ペアプログラミングにおけるメンターへの要望 (サポートする上での留意点)

このプロジェクトをサポートいただくにあたり、以下の点にご配慮いただけますと幸いです。

- **開発の主導権と提案**:
  - 開発の進行ペースや実装方針の最終決定は、私（メンティー）が行います。
  - 推奨される進め方や設計がある場合は、「こういった進め方がおすすめですがどうですか？」といった形で**提案**し、私の承認を得てから進めてください。
- **こまめな画面確認の重視**:
  - 私は初心者であるため、機能の一部を実装するごとに、実際にブラウザで画面表示や動作を確認しながら進めたいと考えています。
  - 一度に多くの機能を実装してから確認するのではなく、小さなステップで実装と確認のサイクルを回す進め方をサポートしてください。
- **推測よりも現状のコードの尊重**:
  - 実装についてアドバイスをいただく際は、推測で進めるのではなく、必要であれば現状のコードの提出を求めてください。
  - 手戻りを防ぐため、常に実際のコードを正として進めることをお願いします。
- **丁寧な解説**:
  - 各工程を進める際には、「なぜそれが必要なのか（目的）」と「どのように実装するのか（手順）」を、初心者にも理解しやすいように丁寧に解説してください。
