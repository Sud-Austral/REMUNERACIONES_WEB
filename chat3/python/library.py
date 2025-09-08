import pandas as pd


def mean_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = df2["remuneracionbruta_mensual"].astype(float).fillna(0).astype(int) 
    return int(round(df2["remuneracionbruta_mensual"].mean()))

def max_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = df2["remuneracionbruta_mensual"].astype(float).fillna(0).astype(int) 
    return int(round(df["remuneracionbruta_mensual"].max()))

def min_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = df2["remuneracionbruta_mensual"].astype(float).fillna(0).astype(int) 
    return int(round(df["remuneracionbruta_mensual"].min()))


