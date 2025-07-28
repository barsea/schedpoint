# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    skip_before_action :require_no_authentication, only: [:create]
    skip_before_action :verify_signed_out_user, only: :destroy
    respond_to :json

    def create
      if user_signed_in?
        render json: Api::V1::UserSerializer.new(current_user).serializable_hash, status: :ok
        return
      end
      self.resource = warden.authenticate(auth_options)
      if resource
        render json: Api::V1::UserSerializer.new(resource).serializable_hash, status: :ok
      else
        render json: {
          status: 401,
          message: 'Invalid email or password.'
        }, status: :unauthorized
      end
    end

    def destroy
      if request.headers['Authorization'].present?
        jwt_payload = JWT.decode(request.headers['Authorization'].split.last,
                                 Rails.application.credentials.devise_jwt_secret_key!).first
        current_user = User.find(jwt_payload['sub'])
      end

      if current_user
        render json: {
          status: 200,
          message: 'Logged out successfully.'
        }, status: :ok
      else
        render json: {
          status: 401,
          message: "Couldn't find an active session."
        }, status: :unauthorized
      end
    end
  end
end
