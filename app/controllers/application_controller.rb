# frozen_string_literal: true

class ApplicationController < ActionController::API
  # Rails APIモードではデフォルトで読み込まれないBasic認証の機能を手動でインクルード
  include ActionController::HttpAuthentication::Basic::ControllerMethods

  # 1. Basic認証を実行するメソッドを登録
  before_action :basic_auth, if: -> { Rails.env.production? }
  # 2. Deviseコントローラーの場合、上記で登録した :basic_auth をスキップ
  skip_before_action :basic_auth, if: :devise_controller?

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  private

  # 3. Basic認証のロジックをここに定義
  def basic_auth
    authenticate_or_request_with_http_basic do |user, password|
      # 環境変数からIDとパスワードを取得して照合
      user == ENV.fetch('BASIC_AUTH_USER') && password == ENV.fetch('BASIC_AUTH_PASSWORD')
    end
  end
end
