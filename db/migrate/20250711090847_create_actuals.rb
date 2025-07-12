class CreateActuals < ActiveRecord::Migration[7.1]
  def change
    create_table :actuals do |t|
      t.text :memo
      t.datetime :start_time, null: false
      t.datetime :end_time,   null: false
      t.references :user,     null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.timestamps
    end
  end
end
