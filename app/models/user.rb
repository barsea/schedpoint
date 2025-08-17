# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :plans, dependent: :destroy
  has_many :actuals, dependent: :destroy

  validates :name, presence: true

  # db:seed実行時にjtiが自動で設定されずにエラーになる問題への対策として、
  # Userレコードが作成される直前に、必ずjtiを生成するコールバックを追加。
  before_create :set_jti

  private

  def set_jti
    # self.jtiに値がセットされていない場合のみ、新しいUUIDを生成してセットする
    self.jti ||= SecureRandom.uuid
  end
end
