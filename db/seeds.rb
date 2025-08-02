# frozen_string_literal: true

# 既存のカテゴリデータを一度すべて削除する
Rails.logger.debug 'Destroying all categories...'
Category.destroy_all

# 登録したいカテゴリデータの配列
# フロントエンドのアイコン配列 ['fas', 'bed'] を、スペース区切りの文字列 "fas bed" として保存する
categories = [
  { name: '睡眠', icon: 'fas bed' },
  { name: '食事', icon: 'fas utensils' },
  { name: 'お風呂', icon: 'fas bath' },
  { name: '移動', icon: 'fas train' },
  { name: '仕事', icon: 'fas briefcase' },
  { name: '学校', icon: 'fas school' },
  { name: '勉強', icon: 'fas book-open' },
  { name: 'スマホ', icon: 'fas mobile-alt' },
  { name: 'PC', icon: 'fas laptop' },
  { name: '遊ぶ', icon: 'fas music' },
  { name: 'ゲーム', icon: 'fas gamepad' },
  { name: 'TV', icon: 'fas tv' },
  { name: '映画', icon: 'fas film' },
  { name: '読書', icon: 'fas book' },
  { name: 'スポーツ', icon: 'fas futbol' },
  { name: '買い物', icon: 'fas shopping-cart' },
  { name: 'カフェ', icon: 'fas mug-saucer' },
  { name: '飲み会', icon: 'fas beer-mug-empty' }
]

# 配列のデータを一つずつデータベースに登録する
Rails.logger.debug 'Creating categories...'
categories.each do |category|
  Category.create!(category)
end

Rails.logger.debug { "Created #{Category.count} categories." }
