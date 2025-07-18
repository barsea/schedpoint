class Api::V1::PlansController < ApplicationController
  before_action :authenticate_user!
  def index
    plans = current_user.plans
    render json: plans
  end
end
