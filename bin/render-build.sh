#!/usr/bin/env bash
# exit on error
set -o errexit

# Gemをインストールする
bundle install

# データベースのマイグレーションを実行する
# (テーブル構造を本番DBに反映させるための最重要コマンド)
bundle exec rake db:migrate

# 初期データを投入する
bundle exec rake db:seed
