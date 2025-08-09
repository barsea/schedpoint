# frozen_string_literal: true

module Api
  module V1
    class ActualsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_actual, only: %i[update destroy]

      def index
        # フロントエンドから送られてきた日付パラメータを取得する
        # パラメータがなければ、今日の日付をデフォルト値として使用する
        date = params[:date] ? Date.parse(params[:date]) : Date.current

        # 取得した日付の範囲（その日の開始から終了まで）を定義する
        day_start = date.beginning_of_day
        day_end = date.end_of_day

        # ログイン中のユーザーに紐づく実績の中から、指定された日付範囲に合致するものを取得する
        # includes(:category) を使って、N+1問題を回避しつつカテゴリ情報も同時に取得する
        actuals = current_user.actuals.includes(:category).where('start_time <= ? AND end_time >= ?', day_end, day_start)

        # シリアライザを呼び出すためのオプションを設定する
        # これにより、Actualに紐づくCategoryの情報もレスポンスに含めることができる
        options = { include: [:category] }

        # シリアライザを使ってデータをJSON形式に整形し、フロントエンドに返す
        render json: Api::V1::ActualSerializer.new(actuals, options).serializable_hash
      end

      def create
        actual = current_user.actuals.build(actual_params)
        if actual.save
          render json: Api::V1::ActualSerializer.new(actual).serializable_hash, status: :created
        else
          render json: { errors: actual.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @actual.update(actual_params)
          render json: Api::V1::ActualSerializer.new(@actual).serializable_hash, status: :ok
        else
          render json: { errors: @actual.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @actual.destroy
        head :no_content
      end

      private

      def set_actual
        @actual = current_user.actuals.find(params[:id])
      end

      def actual_params
        params.require(:actual).permit(:memo, :start_time, :end_time, :category_id)
      end
    end
  end
end
