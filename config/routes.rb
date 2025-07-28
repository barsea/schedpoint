Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }

  namespace :api do
    namespace :v1 do
      resources :plans, only: [:index, :create, :show, :update, :destroy]
      resources :actuals, only: [:index, :create, :show, :update, :destroy]
      resources :categories, only: [:index]
    end
  end
end
