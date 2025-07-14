# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :plans, dependent: :destroy
  has_many :actuals, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
