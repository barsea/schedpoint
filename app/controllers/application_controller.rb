# frozen_string_literal: true

class ApplicationController < ActionController::API # APIモードなので :API を継承
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end
end
