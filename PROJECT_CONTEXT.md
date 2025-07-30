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
- **データベース**: MySQL
- **主要な Gem**:
  - `devise`, `devise-jwt`: トークンベースの API 認証
  - `rspec-rails`: テストフレームワーク
  - `rack-cors`: CORS（クロスオリジンリソース共有）設定
  - `jsonapi-serializer`: 安全で一貫性のある JSON レスポンスの生成
  - `puma`: Web サーバー
  - `rubocop`, `rubocop-rails`: 静的コード解析・フォーマッター

#### フロントエンド

- **フレームワーク**: Vue.js 3 (Composition API)
- **状態管理**: Pinia
- **HTTP クライアント**: Axios
- **ルーティング**: Vue Router
- **UI/スタイリング**: Tailwind CSS, Font Awesome
- **コードフォーマッター**: Prettier

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
      resources :categories, only: [:index]
    end
  end
end
```

### 6. 重要な決定事項

- **アーキテクチャ**: 当初は通常の Rails アプリとして開発を開始したが、途中から**Rails を API モード**、**フロントエンドを Vue.js による SPA**とする構成に方針転換。
- **UI/UX**: MVP（Minimum Viable Product）段階では、PC の画面サイズでも視認性を確保するため、当初の「週間表示」から\*\*「1 日表示」\*\*に表示単位を絞ることを決定。予定の編集・削除は、画面遷移を伴わない**モーダルウィンドウ**で行うことで、スムーズな操作感を実現。
- **認証**: `devise`と`devise-jwt`を使用し、セッションに依存しない**ステートレスな JWT 認証**を実装。
- **API 設計**:
  - 将来の拡張性を考慮し、`api/v1/`のように**バージョンを明記した RESTful API**として設計。
  - コア機能は`EventsController`で一つにまとめるのではなく、責務を明確にするため`PlansController`と`ActualsController`に分割。
  - **API レスポンスの統一**: `jsonapi-serializer`を全面的に採用し、すべての API エンドポイントで構造化された JSON を返すように設計。これによりフロントエンドでのデータハンドリングを簡素化し、保守性を向上。
- **データの一貫性**: `db/seeds.rb` を活用し、アプリケーションの初期データ（カテゴリ一覧など）を定義。これにより、どの開発環境でも同じデータでアプリケーションを起動できる状態を担保。
- **タイムゾーン**: バックエンドは**UTC**で時刻を管理し、フロントエンド側で日本時間（JST）に変換して表示する、グローバルスタンダードな方式を採用。
- **テスト**: バックエンド API の動作確認は**Postman**で実施。テストフレームワークとして**RSpec**を導入済み。
- **コード品質**: `RuboCop`と`Prettier`を導入し、保存時の自動整形を設定することで、コードの品質と一貫性を担保。

### 7. 現在の状況と次のタスク

- **【完了】** ユーザー認証機能（新規登録、ログイン、ログアウト）
- **【完了】** 「予定」の CRUD 管理機能（一覧表示、新規作成、詳細表示、更新、削除）
- **【TODO】** 「実績」の CRUD 管理機能の実装（「予定」の実装を参考に進める）

### 8. ペアプログラミングにおけるメンターへの要望 (サポートする上での留意点)

このプロジェクトをサポートいただくにあたり、以下の点にご配慮いただけますと幸いです。

- **開発の主導権と提案**:
  - 開発の進行ペースや実装方針の最終決定は、私（メンティー）が行います。
  - 推奨される進め方や設計がある場合は、「こういった進め方がおすすめですがどうですか？」といった形で**提案**し、私の承認を得てから進めてください。
- **こまめな画面確認の重視**:
  - 私は初心者であるため、機能の一部を実装するごとに、実際にブラウザで画面表示や動作を確認しながら進めたいと考えています。
  - 一度に多くの機能を実装してから確認するのではなく、小さなステップで実装と確認のサイクルを回す進め方をサポートしてください。
- **推測よりも現状のコードの尊重**:
  - 実装においては、推測で進めるのではなく、必要であれば現状のコードの提出を求めてください。
  - 手戻りを防ぐため、常に実際のコードを正として進めることをお願いします。
- **丁寧な解説**:
  - 各工程を進める際には、「なぜそれが必要なのか（目的）」と「どのように実装するのか（手順）」を、初心者にも理解しやすいように丁寧に解説してください。
