# frozen_string_literal: true

class Api::V1::UserSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :email
end
