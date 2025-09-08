import pandas as pd


def mean_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = (
        pd.to_numeric(df2["remuneracionbruta_mensual"], errors="coerce")
        .fillna(0)
        .astype(int)
    )
    return int(round(df2["remuneracionbruta_mensual"].mean()))

def max_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = (
        pd.to_numeric(df2["remuneracionbruta_mensual"], errors="coerce")
        .fillna(0)
        .astype(int)
    )
    return int(round(df["remuneracionbruta_mensual"].max()))

def min_remuneracionbruta_mensual(df):
    df2 = df.copy()
    df2["remuneracionbruta_mensual"] = (
        pd.to_numeric(df2["remuneracionbruta_mensual"], errors="coerce")
        .fillna(0)
        .astype(int)
    )
    return int(round(df["remuneracionbruta_mensual"].min()))


