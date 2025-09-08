"""
# A very simple Flask Hello World app for you to get started with...

from flask import Flask


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask!'
"""
from flask import Flask
from flask import jsonify,request
from flask_cors import CORS
import pandas as pd
import json
import ssl
import requests
from io import StringIO
ssl._create_default_https_context = ssl._create_unverified_context
app = Flask(__name__)
CORS(app)

df = pd.read_csv("https://raw.githubusercontent.com/Sud-Austral/DATABASE_MASTER/refs/heads/main/miniBase.csv")
#df = pd.read_csv("https://186.67.61.251:8000/archivos/miniBase.csv", nrows=1)
del df["rut"]
df = df.astype(str)
#data = df.to_dict(orient="records")

@app.route('/')
def home():
    try:
        return jsonify({"message": "Bienvenido a la API de Datos de Crimen"})
        #url = "https://186.67.61.251:80/archivos/miniBase.csv"

        # Opcional: ignorar verificación SSL si el certificado no es confiable
        #response = requests.get(url, verify=False, headers={"User-Agent": "Mozilla/5.0"})

        #if response.status_code == 200:
            # Leer CSV desde el contenido descargado
            #df = pd.read_csv(StringIO(response.text), nrows=10)
            #print(df)
        #else:
            #print("Error al acceder a la URL:", response.status_code)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    return jsonify({"message": "Bienvenido a la API de Datos de Crimen"})

@app.route('/query/')
def answer_query():
    #query = request.args.get('query', '')
    query = request.args.get('query', '')
    # Lista de columnas que quieres aceptar como filtros
    filtros_permitidos = ['organismo_nombre', 'anyo', 'mes', 'base']

    # Crear un diccionario con los parámetros que sí se enviaron
    query_dict = {}
    for col in filtros_permitidos:
        val = request.args.get(col)
        if val is not None:
            # Convertir al tipo de la columna en el DataFrame
            dtype = df[col].dtype
            if pd.api.types.is_integer_dtype(dtype):
                val = int(val)
            elif pd.api.types.is_float_dtype(dtype):
                val = float(val)
            # Si es string, se queda como está
            query_dict[col] = val

    filter_df = df.copy()
    for col in query_dict.keys():
        filter_df = filter_df[filter_df[col] == query_dict[col]]
    try:
        print(query)
        #return jsonify({"response": data})
        json_data = json.dumps(filter_df.to_dict(orient="records"), ensure_ascii=False, indent=0)
        return app.response_class(json_data, mimetype='application/json')
        #return jsonify(query_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500