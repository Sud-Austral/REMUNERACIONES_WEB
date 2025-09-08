
//const apiKey = 'AIzaSyCVFFxs6RlhqgskHpZgkZ7Ivug1fm4HJk8';
const apiKey = 'AIzaSyDLzplCcOl_xbZWghCnwCP9Qmw7cE_eg6o';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

// Historial de la conversación
let conversationHistory = [];

// Variable para saber si ya mandamos los datos crudos
let datosCargados = false;
//const datos = data

// Variable global para almacenar el historial de la conversación
let historialConversacion = [];
let historialConversacion2 = [];



async function llamarAPI(urlGenerada) {
    try {
        // Validar que sea una URL válida
        let url;
        try {
            url = new URL(urlGenerada);
        } catch {
            throw new Error("La respuesta no es una URL válida");
        }

        // Validar que pertenezca a tu dominio permitido
        if (!url.href.startsWith("https://lmonsalve22.pythonanywhere.com/query/")) {
            throw new Error("La URL no pertenece al dominio permitido");
        }

        // Hacer la llamada a la API
        const response = await fetch(url.href, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-User": "?1",
                    "Cache-Control": "max-age=0"
                }
            });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        return data;

    } catch (error) {
        console.error("Error al llamar a la API generada:", error);
        return { error: error.message };
    }
}

async function obtenerRespuesta(pregunta) {
    // Agregar la pregunta del usuario al historial
    historialConversacion.push({
        role: "user",
        parts: [{ text: pregunta }]
    });

    
    // 🔹 Paso 3: armar el prompt base

    const promptBase = `Tu deber como asistente simplemente es extraer los parametros para generar una consulta a un api de la forma 

                    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Asociaci%C3%B3n%20de%20Municipalidades%20de%20la%20Regi%C3%B3n%20de%20OHiggins&base=Codigotrabajo&mes=Marzo&query=promedio
                    
                    de manera general:
                    https://lmonsalve22.pythonanywhere.com/query/?anyo={año}&organismo_nombre={organismo}&base={Contrato}&mes={Mes}&query={query}
                    Donde
                    año = el año de la consulta, siempre en numerico en formato 4 digitos
                    organismo = nombre del organismo
                    base = tipo de contrato
                    mes= Mes de la consulta, siempre en español y con la letra inicial en mayuscula
                    Por ejemplo
                    Pregunta
                    ¿cual es el total de trabajadores para la agencia de Eficiencia energetica el setiembre del 23 con contrato de honorarios?
                    año = 2023
                    organismo = Es un organismo del estado de Chile, puede ser solo uno de los siguientes: ${listaOrganismo}
                    base = Es la relaccion contractual, puede ser: Contrata, Contratohonorarios, Planta, Codigotrabajo
                    mes= Es el nombre del mes, debe ser solo uno de los siguientes: Julio,Junio,Mayo,Abril,Marzo,Febrero,Enero,Diciembre,Noviembre,Octubre,Septiembre,Agosto
                    query= es la query definida en la pregunta, puede ser promedio o maximo
                    Query
                    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Agencia Chilena de Eficiencia Energética&base=Contratohonorarios&mes=Septiembre&query=promedio
                    Respuesta
                    Para tu respuesta solo debes dar la url de la api, en este caso:
                    https://lmonsalve22.pythonanywhere.com/query/?anyo=2023&organismo_nombre=Agencia%20Chilena%20de%20Eficiencia%20Energ%C3%A9tica&base=Contratohonorarios&mes=Septiembre&query=promedio
                    Solo la url y nada mas 
                    Si no existe uno o más variables, de igual manera generaras la url con la informacion que tengas
                    Ejemplo
                    ¿Cual es el sueldo promedio en el año 24?
                    año = 2024
                    Query
                    https://lmonsalve22.pythonanywhere.com/query/?anyo=2024&query=promedio
                    Respuesta
                    https://lmonsalve22.pythonanywhere.com/query/?anyo=2024&query=promedio
                    Si no eres capaz de construir la url, indicale MUY AMABLEMENTE al usuario como puede mejorar su pregunta para poder generar una respuesta.Solo ayuda a estructurar una pregunta tipo y darle siempre la siguiente pregunta como ejemplo: 
                    ¿Cuál es la remuneracion promedio para la agencia de Eficiencia energetica el setiembre del 23 con contrato de honorarios?
                    `;

    // 🔹 Paso 4: preparar contenidos para Gemini
    const contenidos = [
        {
            role: "user",
            parts: [{ text: promptBase }]
        }
    ];

    // Agregamos el historial de conversación
    contenidos.push(...historialConversacion);

    const requestBody = {
        contents: contenidos
    };

    // 🔹 Paso 5: llamada a la API de Gemini
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

        const dataResp = await response.json();
        

        // Manejo seguro de la respuesta
        if (dataResp?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const respuesta = dataResp.candidates[0].content.parts[0].text.trim();
            if(!respuesta.includes("lmonsalve22.pythonanywhere.com")){
                return respuesta;
            }
            const respuesta2 = await llamarAPI(respuesta);
            const respuestaFinal = await obtenerRespuestaFinal(pregunta,respuesta2["respuesta"])

            console.log(respuesta);
            console.log(respuesta2);
            //console.log(respuestaFinal);

            // Agregar la respuesta del modelo al historial
            historialConversacion.push({
                role: "model",
                parts: [{ text: respuesta }]
            });

            //return respuesta;
            return respuestaFinal;
        } else {
            throw new Error("Respuesta inesperada de la API de Gemini");
        }
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        return "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.";
    }
}

async function obtenerRespuestaFinal(pregunta, respuesta) {
    // Agregar la pregunta del usuario al historial
    historialConversacion2.push({
        role: "user",
        parts: [{ text: pregunta }]
    });

    
    // 🔹 Paso 3: armar el prompt base

    const promptBase = `Eres un asistente experto en análisis de datos de empleo público en Chile.
        Tu deber como asistente es estructurar una respuesta a la siguiente pregunta: ${pregunta} con esta respuesta: ${respuesta} con las siguientes reglas:
        Instrucciones:
            1. Inicia la respuesta con una frase amigable.
            2. La respuesta debe ser formal, con lenguaje empresarial.
            3. Responde de manera clara y concisa.
            4. Redacta la respuesta a partir de la pregunta, por ejemplo: ¿Cual es el sueldo promedio en el año 24?, El suelo promedio en el año 2024 ..., seria una respuesta adecuada.            
            5. Genera un resumen del resultado usando lenguaje natural.
            6. Tono Conversacional, Nivel Básico
            7. Debes identificar si esta haciendo una pregunta, si no esta haciendola, por favor indicale amablemente que haga una consulta.
            8. Ofrece preguntas de seguimiento.
            9. El resultado debes darlo con formato chileno, la unidad es Pesos Chilenos.
            10. La respuesta esta calculada desde una base de datos oficial, no es un numero estimado ni proyectado, es un numero real desde una base de datos real.
            11. No repitas texto en tu respuesta, intenta explicar la respuesta sin ser rebundante`;
            

    // 🔹 Paso 4: preparar contenidos para Gemini
    const contenidos = [
        {
            role: "user",
            parts: [{ text: promptBase }]
        }
    ];

    // Agregamos el historial de conversación
    contenidos.push(...historialConversacion);

    const requestBody = {
        contents: contenidos
    };

    // 🔹 Paso 5: llamada a la API de Gemini
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

        const dataResp = await response.json();
        

        // Manejo seguro de la respuesta
        if (dataResp?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const respuesta = dataResp.candidates[0].content.parts[0].text.trim();
            // Agregar la respuesta del modelo al historial
            historialConversacion.push({
                role: "model",
                parts: [{ text: respuesta }]
            });

            return respuesta;
        } else {
            throw new Error("Respuesta inesperada de la API de Gemini");
        }
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        return "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.";
    }
}




// Función para limpiar el historial cuando sea necesario
function limpiarHistorial() {
    historialConversacion = [];
}




