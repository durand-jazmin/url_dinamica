"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var obtenerUbicacionButton = document.getElementById("obtenerUbicacion");
  var ubicacionParrafo = document.getElementById("ubicacion");
  var resultadoParrafo = document.getElementById("resultadoParrafo");

  obtenerUbicacionButton.addEventListener("click", obtenerUbicacion);

  function obtenerUbicacion() {
    // Muestra un mensaje paso a paso
    ubicacionParrafo.textContent = "Obteniendo ubicación...";

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          ubicacionParrafo.textContent = `Latitud: ${latitude}, Longitud: ${longitude}`;
          resultadoParrafo.textContent =
            "Obteniendo ubicación. Realizando solicitud a la API...";

          obtenerPronosticoLluvia(latitude, longitude);
        },
        function (error) {
          ubicacionParrafo.textContent = `Error: ${error.message}`;
        }
      );
    } else {
      ubicacionParrafo.textContent =
        "La geolocalización no está disponible en este navegador.";
    }
  }

  function obtenerPronosticoLluvia(latitude, longitude) {
    const apiKey = "80e51649ca0054038d08f10ffa6265c3"; // Reemplaza con tu clave de API de OpenMeteo
    var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=rain&timezone=auto&forecast_days=1`;

    resultadoParrafo.textContent = "Realizando la solicitud a la API...";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa");
        }
        return response.json();
      })
      .then((data) => {
        mostrarPronosticoLluviaPorHoras(data); // Llama a la función para mostrar las tarjetas
      })
      .catch((error) => {
        resultadoParrafo.textContent =
          "Error al obtener el pronóstico: " + error.message;
      });
  }

  function mostrarPronosticoLluviaPorHoras(data) {
    // Comprobamos si existen datos de lluvia y si hay datos disponibles
    if (data.hourly && data.hourly.rain && data.hourly.rain.length > 0) {
      // Extraemos los tiempos y las cantidades de lluvia del objeto de datos
      const tiempos = data.hourly.time;
      const cantidadesLluvia = data.hourly.rain;

      // Establecemos el contenido del elemento con id "resultadoParrafo"
      resultadoParrafo.textContent =
        "Pronóstico de lluvia para las próximas 8 horas:";

      // Creamos un elemento contenedor para mostrar el pronóstico
      const contenedor = document.createElement("div");

      // Limitamos el número de horas a mostrar a las próximas 8
      for (let i = 0; i < 8; i++) {
        const tiempo = tiempos[i]; // Obtenemos el tiempo (hora)
        const lluvia = cantidadesLluvia[i]; // Obtenemos la cantidad de lluvia en mm

        // Creamos un elemento para mostrar la hora
        const elementoHora = document.createElement("p");
        elementoHora.textContent = `Hora: ${tiempo}`;

        // Creamos un elemento para mostrar la cantidad de lluvia
        const elementoLluvia = document.createElement("p");
        elementoLluvia.textContent = `Lluvia: ${lluvia} mm`;

        // Agregamos los elementos de hora y lluvia al contenedor
        contenedor.appendChild(elementoHora);
        contenedor.appendChild(elementoLluvia);
      }

      // Agregamos el contenedor con las horas de lluvia al elemento con id "resultadoParrafo"
      resultadoParrafo.appendChild(contenedor);
    } else {
      // En caso de que no haya datos disponibles, mostramos un mensaje de error
      resultadoParrafo.textContent =
        "No se encontraron datos de lluvia en el pronóstico.";
    }
  }
});
