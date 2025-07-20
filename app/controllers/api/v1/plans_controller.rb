class Api::V1::PlansController < ApplicationController
  before_action :authenticate_user!
  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.current
    plans = current_user.plans.where(start_time: date.all_day)
    render json: plans
  end

  def show
    @plan = current_user.plans.find(params[:id])
    render json: @plan
  end

  def create
    plan = current_user.plans.build(plan_params)

    if plan.save
      render json: plan, status: :created
    else
      render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def plan_params
    params.require(:plan).permit(:memo, :start_time, :end_time, :category_id)
  end
end
