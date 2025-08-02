# frozen_string_literal: true

module Api
  module V1
    class ActualsController < ApplicationController
      before_action :authenticate_user!

      def create
        actual = current_user.actuals.build(actual_params)
        if actual.save
          render json: Api::V1::ActualSerializer.new(actual).serializable_hash, status: :created
        else
          render json: { errors: actual.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def actual_params
        params.require(:actual).permit(:memo, :start_time, :end_time, :category_id)
      end
    end
  end
end
