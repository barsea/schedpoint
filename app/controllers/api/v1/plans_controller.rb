class Api::V1::PlansController < ApplicationController
  before_action :authenticate_user!
  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.current
    plans = current_user.plans.where(start_time: date.all_day)
    render json: plans
  end
end
