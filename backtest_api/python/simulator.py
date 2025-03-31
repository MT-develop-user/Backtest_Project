#!/usr/bin/env python3
import sys
import json
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def simulate(monthly_investment, years, ticker_symbol):
    # シミュレーション期間の開始日を計算（余裕を持って30日分追加）
    start_date = datetime.today() - timedelta(days=365 * int(years) + 30)
    ticker = yf.Ticker(ticker_symbol)
    hist = ticker.history(start=start_date.strftime('%Y-%m-%d'), end=datetime.today().strftime('%Y-%m-%d'))

    if hist.empty:
        return {"error": "データが取得できませんでした。"}

    total_units = 0.0
    total_invested = 0.0

    # 'Date' を datetime 型に変換（インデックスが日付なので）
    hist['Date'] = pd.to_datetime(hist.index)

    # シンプルに各月の最初の取引日の終値で購入するシミュレーション
    current_date = start_date
    while current_date < datetime.today():
        # 'YYYY-MM' 形式で月を取得
        month_str = current_date.strftime('%Y-%m')

        # 月ごとのデータをフィルタリング
        month_data = hist[hist['Date'].dt.strftime('%Y-%m') == month_str]

        if not month_data.empty:
            # 最初の行の終値を利用
            price = month_data.iloc[0]['Close']
            units = float(monthly_investment) / price
            total_units += units
            total_invested += float(monthly_investment)

        # 次の月へ（単純に月を増やす）
        if current_date.month == 12:
            current_date = current_date.replace(year=current_date.year + 1, month=1)
        else:
            current_date = current_date.replace(month=current_date.month + 1)

    # 最終的な資産価値は、最新の終値×累計保有単位数
    final_price = hist['Close'].iloc[-1]  # 最新の終値を取得
    final_value = total_units * final_price

    return {
        "total_invested": total_invested,
        "final_value": final_value,
        "total_units": total_units,
        "ticker": ticker_symbol
    }

def main():
    # print("Received arguments:", sys.argv, flush=True)  #debug

    if len(sys.argv) < 2:
        print(json.dumps({"error": "パラメータが指定されていません。"}))
        return

    try:
        params = json.loads(sys.argv[1])
        monthly_investment = params.get("monthly_investment", 10000)  # デフォルトは1万円
        years = params.get("years", 10)  # デフォルトは10年
        ticker_symbol = params.get("ticker", "QLD")
        result = simulate(monthly_investment, years, ticker_symbol)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
