class Api::V1::PlansController < ApplicationController
  before_action :authenticate_user!
  before_action :set_plan, only: %i[show update destroy]

  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.current
    plans = current_user.plans.where(start_time: date.all_day)
    render json: plans
  end

  def show
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

  def update
    if @plan.update(plan_params)
      render json: @plan, status: :ok
    else
      render json: { errors: @plan.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @plan.destroy
    head :no_content
  end

  private

  def set_plan
    @plan = current_user.plans.find(params[:id])
  end

  def plan_params
    params.require(:plan).permit(:memo, :start_time, :end_time, :category_id)
  end
end
