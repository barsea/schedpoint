# frozen_string_literal: true

class Plan < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :memo, length: { maximum: 100 }
  validate :start_time_cannot_be_after_end_time

  private

  def start_time_cannot_be_after_end_time
    # start_timeかend_timeが空の場合はこのチェックは行わない
    return if start_time.blank? || end_time.blank?

    # もし開始時刻が終了時刻より後だったら...
    return unless start_time > end_time

    # エラーメッセージを追加
    errors.add(:start_time, 'は終了時刻より前に設定してください')
  end
end
