class SimulationsController < ApplicationController
    wrap_parameters false
    require 'open3'
    
    def create
      # POSTされたJSONパラメータを許可
      simulation_params = params.permit(:monthly_investment, :years, :ticker)
      
      # Pythonスクリプトを呼び出し、結果を取得
      result = run_simulation(simulation_params.to_h)
      render json: result
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
    
    private
    
    def run_simulation(params)
      script_path = Rails.root.join('python', 'simulator.py')
      json_string = params.to_json

      # pythonコマンドを実行
      stdout, stderr, status = Open3.capture3("python", script_path.to_s, json_string)
      
      raise "Python script error: #{stderr}" unless status.success?
      JSON.parse(stdout)
    end
  end
