# frozen_string_literal: true

module Api
  module V1
    class PlansController < ApplicationController
      before_action :authenticate_user!
      before_action :set_plan, only: %i[show update destroy]

      def index
        date = params[:date] ? Date.parse(params[:date]) : Date.current

        day_start = date.beginning_of_day
        day_end = date.end_of_day

        plans = current_user.plans.includes(:category).where('start_time <= ? AND end_time >= ?', day_end, day_start)
        # シリアライザを呼び出すためのオプション（これでActualに紐づくCategoryの情報も含めてくれる）
        options = { include: [:category] }
        render json: Api::V1::PlanSerializer.new(plans, options).serializable_hash
      end

      def show
        render json: Api::V1::PlanSerializer.new(@plan).serializable_hash
      end

      def create
        plan = current_user.plans.build(plan_params)
        if plan.save
          render json: Api::V1::PlanSerializer.new(plan).serializable_hash, status: :created
        else
          render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @plan.update(plan_params)
          render json: Api::V1::PlanSerializer.new(@plan).serializable_hash, status: :ok
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
  end
end
