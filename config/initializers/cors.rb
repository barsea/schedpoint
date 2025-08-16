# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Rails.env.development? で、開発環境か本番環境かを判断します
    if Rails.env.development?
      # 開発環境では、これまで通りどこからでもアクセスを許可します
      origins '*'
    else
      # 本番環境では、環境変数で指定されたURLからのみアクセスを許可します
      origins ENV.fetch('FRONTEND_URL')
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      # フロントエンドがAuthorizationヘッダーを読み取れるように設定
      expose: ['Authorization']
  end
end
