class Category < ApplicationRecord
  has_many :plans
  has_many :actuals

  validates :name, presence: true, uniqueness: true
end
