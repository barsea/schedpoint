# SchedPoint プロジェクトサマリー

### 1. アプリケーションの概要

`SchedPoint`は、日々の「予定」と「実績」を時間軸上で可視化し、比較・分析することで、ユーザーの時間管理能力の向上をサポートする Web アプリケーションです。

**主要な機能:**

- **ユーザー認証**: 新規登録、ログイン、ログアウト機能。
- **予定・実績の CRUD 管理**: カレンダー形式の UI で、日々の予定と、実際に行動した実績を記録・閲覧・更新・削除する機能。

### 2. 技術スタック

モダンな Web 開発で標準的な、バックエンドとフロントエンドを完全に分離した**SPA（シングルページアプリケーション）**構成を採用しています。

#### バックエンド

- **Ruby**: `3.2.0`
- **Rails**: `7.1.5` (API モード)
- **データベース**: MySQL
- **主要な Gem**:
  - `devise`, `devise-jwt`: トークンベースの API 認証
  - `rspec-rails`: テストフレームワーク
  - `rack-cors`: CORS（クロスオリジンリソース共有）設定
  - `jsonapi-serializer`: 安全な JSON レスポンスの生成
  - `puma`: Web サーバー
  - `rubocop`, `rubocop-rails`: 静的コード解析・フォーマッター

#### フロントエンド

- **フレームワーク**: Vue.js 3 (Composition API)
- **状態管理**: Pinia
- **HTTP クライアント**: Axios
- **ルーティング**: Vue Router
- **UI/スタイリング**: Tailwind CSS
- **コードフォーマッター**: Prettier

### 3. データベーススキーマ

```ruby
ActiveRecord::Schema[7.1].define(version: 2025_07_14_031635) do
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

※ `app/models/`配下のファイル内容です。

**`user.rb`**

```ruby
# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :plans, dependent: :destroy
  has_many :actuals, dependent: :destroy

  validates :name, presence: true
end
```

**`plan.rb`**

```ruby
class Plan < ApplicationRecord
  belongs_to :user
  belongs_to :category
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
    end
  end
end
```

### 6. 重要な決定事項

- **アーキテクチャ**: 当初は通常の Rails アプリとして開発を開始したが、途中から**Rails を API モード**、**フロントエンドを Vue.js による SPA**とする構成に方針転換。
- **UI/UX**: MVP（Minimum Viable Product）段階では、PC の画面サイズでも視認性を確保するため、当初の「週間表示」から\*\*「1 日表示」\*\*に表示単位を絞ることを決定。
- **認証**: `devise`と`devise-jwt`を使用し、セッションに依存しない**ステートレスな JWT 認証**を実装。
- **API 設計**:
  - 将来の拡張性を考慮し、`api/v1/`のように**バージョンを明記した RESTful API**として設計。
  - コア機能は`EventsController`で一つにまとめるのではなく、責務を明確にするため`PlansController`と`ActualsController`に分割。
- **タイムゾーン**: バックエンドは**UTC**で時刻を管理し、フロントエンド側で**日本時間（JST）**に変換して表示する、グローバルスタンダードな方式を採用。
- **テスト**: バックエンド API の動作確認は**Postman**で実施。テストフレームワークとして**RSpec**を導入済み。
- **コード品質**: `RuboCop`と`Prettier`を導入し、保存時の自動整形を設定することで、コードの品質と一貫性を担保。
