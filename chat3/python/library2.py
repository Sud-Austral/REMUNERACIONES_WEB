import pandas as pd


def mean_remuneracionbruta_mensual(df):
    resultado = df.copy()    
    return int(round(resultado["sum_remun"].sum() / resultado["registros"].sum()))


def cantidad_registros(df):
    resultado = df.copy()
    return int(resultado["registros"].sum())

def max_remuneracionbruta_mensual(df):
    resultado = df.copy()
    return int(resultado["max_remun"].max())

def min_remuneracionbruta_mensual(df):
    resultado = df.copy()
    return int(resultado["min_remun"].min())

