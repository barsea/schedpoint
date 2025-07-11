Rails.application.routes.draw do
  devise_for :users
  get 'events/index'
    root to: "events#index"
end
