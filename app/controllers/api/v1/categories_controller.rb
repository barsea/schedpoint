class Api::V1::CategoriesController < ApplicationController
  before_action :authenticate_user! # ログインしているユーザーのみアクセス可能

  def index
    categories = Category.all.order(:id) # id順で並び替えて取得
    # CategorySerializerを使ってJSONを返す
    render json: Api::V1::CategorySerializer.new(categories).serializable_hash
  end
end
