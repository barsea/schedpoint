# frozen_string_literal: true

module Api
  module V1
    class PlanSerializer
      include JSONAPI::Serializer

      # フロントエンドに渡したいカラム名を指定
      attributes :id, :memo, :start_time, :end_time

      # カテゴリ情報も一緒にフロントエンドへ返せるように、関連を定義
      belongs_to :category
    end
  end
end
