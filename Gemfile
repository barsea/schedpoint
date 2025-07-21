# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.2.0'

gem 'rails', '~> 7.1.5', '>= 7.1.5.1'

# データベース
gem 'mysql2', '~> 0.5'

# API関連のGem
gem 'devise'
gem 'devise-jwt'
gem 'jsonapi-serializer'
gem 'rack-cors'

# Webサーバー
gem 'puma', '>= 5.0'

# Railsの基本機能
gem 'jbuilder'
gem 'sprockets-rails'

# Windows用の設定
gem 'tzinfo-data', platforms: %i[windows jruby]

# 起動高速化
gem 'bootsnap', require: false

# 開発環境とテスト環境でのみ使用するGem
group :development, :test do
  gem 'debug', platforms: %i[mri windows]
  gem 'rspec-rails', '~> 6.1'
end

# 開発環境でのみ使用するGem
group :development do
  gem 'foreman'
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
  gem 'web-console'
end

# テスト環境でのみ使用するGem
group :test do
  gem 'capybara'
  gem 'selenium-webdriver'
end
