# frozen_string_literal: true

# app/serializers/api/v1/category_serializer.rb
module Api
  module V1
    class CategorySerializer
      include JSONAPI::Serializer
      attributes :id, :name, :icon
    end
  end
end
