import yfinance as yf
import pandas as pd
import pandas_ta as ta
import numpy as np
npNan = np.nan

tickers = ["AAPL"]

def get_data(tickers):

    data = []

    for ticker in tickers:
        df = yf.download(ticker, "2022-01-01", "2025-01-01", "1d")
        print(df.shape)
        df["Ticker"] = ticker
        df["ROC"] = df["Close"].pct_change(periods=10) * 100
        # df["ATR"] = ta.atr(df["High"], df["Low"], df["Close"], length=14)
        # df["OBV"] = ta.obv(df["Close"], df["Volume"])

        df.dropna(inplace=True)
        data.append(df)
        final_df = pd.concat(data)
        final_df.reset_index(inplace=True)
        final_df = final_df[["Date", "Ticker", "High", "Low", "Open", "Close", "Volume", "ROC"]]


    final_df.to_csv("stocks.csv")
    file = pd.read_csv("stocks.csv")
    file = file.drop(index=0)
    file.to_csv("stocks.csv")
    
get_data(tickers)