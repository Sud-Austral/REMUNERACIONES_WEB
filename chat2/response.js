
//const apiKey = 'AIzaSyCVFFxs6RlhqgskHpZgkZ7Ivug1fm4HJk8';
const apiKey = 'AIzaSyDLzplCcOl_xbZWghCnwCP9Qmw7cE_eg6o';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;




async function obtenerRespuesta(pregunta) {
    const prompt = `Tu deber como asistente simplemente es extraer los parametros para generar una consulta a un api de la forma 

    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Asociaci%C3%B3n%20de%20Municipalidades%20de%20la%20Regi%C3%B3n%20de%20OHiggins&base=Codigotrabajo&mes=Marzo 
    
    de manera general:
    https://lmonsalve22.pythonanywhere.com/query/?anyo={año}&organismo_nombre={organismo}&base={Contrato}&mes={Mes}
    Donde
    año = el año de la consulta, siempre en numerico en formato 4 digitos
    organismo = nombre del organismo
    base = tipo de contrato
    mes= Mes de la consulta, siempre en español y con la letra inicial en mayuscula
    Por ejemplo
    Pregunta
    ¿cual es el total de trabajadores para la agencia de Eficiencia energetica el setiembre del 23 con contrato de honorarios?
    año = 2023
    organismo = Agencia Chilena de Eficiencia Energética
    base = Contratohonorarios
    mes= Septiembre
    Query
    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Agencia Chilena de Eficiencia Energética&base=Contratohonorarios&mes=Septiembre
    Respuesta
    Para tu respuesta solo debes dar la url de la api, en este caso:
    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Agencia%20Chilena%20de%20Eficiencia%20Energ%C3%A9tica&base=Contratohonorarios&mes=Septiembre
    Solo la url y nada mas 
    Si no existe uno o más variables, de igual manera generaras la url con la informacion que tengas
    Ejemplo
    ¿Cual es el sueldo promedio en el año 24?
    año = 2024
    Query
    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023
    Respuesta
    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023
    Si no detectas ninguna variable tu respuesta debe ser:
    https://lmonsalve22.pythonanywhere.com/query/

    La pregunta del usuario es: ${pregunta} `;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)

        // Manejo seguro de la respuesta
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log(data.candidates[0].content.parts[0].text.trim())
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("Respuesta inesperada de la API de Gemini");
        }
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        return "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.";
    }
}
