# frozen_string_literal: true

module Api
  module V1
    class UserSerializer
      include JSONAPI::Serializer
      attributes :id, :name, :email
    end
  end
end
