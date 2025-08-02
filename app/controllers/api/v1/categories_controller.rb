# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ApplicationController
      before_action :authenticate_user! # ログインしているユーザーのみアクセス可能

      def index
        categories = Category.order(:id) # id順で並び替えて取得
        # CategorySerializerを使ってJSONを返す
        render json: Api::V1::CategorySerializer.new(categories).serializable_hash
      end
    end
  end
end
