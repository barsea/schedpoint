# frozen_string_literal: true

class Plan < ApplicationRecord
  belongs_to :user
  belongs_to :category

  validates :start_time, presence: true
  validates :end_time, presence: true
end
