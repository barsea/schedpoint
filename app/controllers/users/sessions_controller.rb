# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    skip_before_action :require_no_authentication, only: [:create]
    respond_to :json

    def create
      if user_signed_in?
        render json: {
          status: { code: 200, message: 'You are already logged in.' },
          data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
        }
        return
      end
      self.resource = warden.authenticate(auth_options)
      if resource
        sign_in(resource_name, resource)
        render json: {
          status: { code: 200, message: 'Logged in successfully.' },
          data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
        }
      else
        render json: {
          status: 401,
          message: 'Invalid email or password.'
        }, status: :unauthorized
      end
    end

    private

    def respond_to_on_destroy
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
