
//const apiKey = 'AIzaSyCVFFxs6RlhqgskHpZgkZ7Ivug1fm4HJk8';
const apiKey = 'AIzaSyDLzplCcOl_xbZWghCnwCP9Qmw7cE_eg6o';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

// Historial de la conversación
let conversationHistory = [];

// Variable para saber si ya mandamos los datos crudos
let datosCargados = false;
const datos = data

// Variable global para almacenar el historial de la conversación
let historialConversacion = [];




async function obtenerRespuesta(pregunta) {
    // Agregar la pregunta del usuario al historial
    historialConversacion.push({
        role: "user",
        parts: [{ text: pregunta }]
    });

    
    

    // 🔹 Paso 2: convertir el resumen a texto
    const resumenTexto = data["datos"].map(d => 
        `- Organismo: ${d.organismo}, Año: ${d.año}, Tipo Contrato: ${d.tipo_contrato}, Calificación: ${d.calificacion}, Personas: ${d.personas}, Remuneración Promedio: $${d.remuneracion.toLocaleString()}`
    ).join('\n');
    console.log(resumenTexto)
    // 🔹 Paso 3: armar el prompt base

    const promptBase = `Eres un asistente experto en análisis de datos de empleo público en Chile.

    Muestra de datos crudos (estructura de los datos):
    ${resumenTexto}

    Instrucciones:
        1. Responde de manera clara y concisa.
        2. Redacta como respuesta la pregunta.
        3. Inicia la respuesta con una frase amigable.
        4. Genera un resumen del resultado usando lenguaje natural.
    
    
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
        console.log(dataResp);

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



async function obtenerRespuesta3(pregunta) {
    // Agregar la pregunta del usuario al historial
    historialConversacion.push({
        role: "user",
        parts: [{ text: pregunta }]
    });
    
    // Construir el prompt con los datos
    const promptBase = `Eres un asistente experto en análisis de datos de empleo público en Chile. 
    
    Muestra de datos crudos (estructura de los datos):
    ${data["datos"].map(d => 
        `- Organismo: ${d.organismo}, Año: ${d.año}, Tipo Contrato: ${d.tipo_contrato}, Calificación: ${d.calificacion}, Personas: ${d.personas}, Remuneración Promedio: $${d.remuneracion.toLocaleString()}`
    ).join('\n')}`;
    
    // Para Gemini Flash, es importante formatear correctamente el historial
    // Creamos un array de contenidos que incluye el prompt base y el historial
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
        console.log(data);
        
        // Manejo seguro de la respuesta
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const respuesta = data.candidates[0].content.parts[0].text.trim();
            
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



async function obtenerRespuesta2(pregunta) {
    const prompt = `Eres un asistente experto en análisis de datos de empleo público en Chile. 
    

    Muestra de datos crudos (estructura de los datos):
    ${data["datos"].map(d => 
        `- Organismo: ${d.organismo}, Año: ${d.año}, Tipo Contrato: ${d.tipo_contrato}, Calificación: ${d.calificacion}, Personas: ${d.personas}, Remuneración Promedio: $${d.remuneracion.toLocaleString()}`
    ).join('\n')}

    El usuario pregunta: "${pregunta}"

    Instrucciones:
    1. Si la pregunta es sobre un organismo específico y se han aplicado filtros (especialmente por año), usa los DATOS FILTRADOS POR ORGANISMO para responder.
    2. Si la pregunta requiere comparar con datos históricos (otros años) o sin filtros, usa los DATOS GENERALES POR ORGANISMO.
    3. Responde de manera clara y concisa.
    4. Si la pregunta requiere información que no está en los datos, indícalo amablemente.
    5. Incluye valores numéricos específicos cuando sea posible.`;

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
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("Respuesta inesperada de la API de Gemini");
        }
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        return "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta nuevamente más tarde.";
    }
}
