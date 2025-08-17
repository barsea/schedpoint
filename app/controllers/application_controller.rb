# frozen_string_literal: true

class ApplicationController < ActionController::API
  # Rails APIモードではデフォルトで読み込まれないBasic認証の機能を手動でインクルード
  include ActionController::HttpAuthentication::Basic::ControllerMethods

  # 本番環境(production)の場合のみ、Basic認証を実行するように設定する。
  # IDとパスワードは、.envファイルで設定した環境変数から読み込む。
  if Rails.env.production?
    http_basic_authenticate_with name: ENV.fetch('BASIC_AUTH_USER'), password: ENV.fetch('BASIC_AUTH_PASSWORD')
  end

  # Deviseのコントローラーの場合、Basic認証をスキップします。
  skip_before_action :authenticate, if: :devise_controller?

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end
end
