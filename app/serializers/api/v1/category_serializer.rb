# app/serializers/api/v1/category_serializer.rb
class Api::V1::CategorySerializer
  include JSONAPI::Serializer
  attributes :id, :name
end
