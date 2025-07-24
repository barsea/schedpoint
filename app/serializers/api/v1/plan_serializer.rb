# app/serializers/api/v1/plan_serializer.rb

class Api::V1::PlanSerializer
  include JSONAPI::Serializer

  # 1. フロントエンドに渡したいカラム名を指定
  attributes :id, :memo, :start_time, :end_time

  # 2. 関連するモデルの情報も渡す場合は、ここで関連を定義
  # これにより、Categoryの情報も一緒に含めることができる
  belongs_to :category
end
