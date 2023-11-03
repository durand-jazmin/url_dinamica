"use strict";

document.addEventListener("DOMContentLoaded", function () {
  //oyente para esperar que el dom este cargado
  var obtenerUbicacionButton = document.getElementById("obtenerUbicacion"); //obtiene el boton con id obtenerUbicacion
  var ubicacionParrafo = document.getElementById("ubicacion"); //parrafo con id ubicacion donde se muestra la ubicacion
  var resultadoParrafo = document.getElementById("resultadoParrafo"); //obtiene el parrafo dende muestra el resultado
  obtenerUbicacionButton.addEventListener("click", obtenerUbicacion); //oyente para el click

  function obtenerUbicacion() {
    //se ejecutara cuando le den click al btn
    if ("geolocation" in navigator) {
      //en caso que si admite geolocalizacion el navegador
      navigator.geolocation.getCurrentPosition(
        //
        function (position) {
          var latitude = position.coords.latitude; //obtiene latitud de la ubicacion
          var longitude = position.coords.longitude; //obtiene longuitud de la ubicacion

          ubicacionParrafo.textContent = `Latitud: ${latitude}, Longitud: ${longitude}`; //muestra lat y lon en el parrafo de ubi
          resultadoParrafo.textContent =
            "Obteniendo ubicación. Realizando solicitud a la API..."; //mens de estado

          obtenerPronosticoLluvia(latitude, longitude); //llama a la funcion pronostico lluvia
        },
        function (error) {
          ubicacionParrafo.textContent = `Error: ${error.message}`; //algun problema con la geolocal
        }
      );
    } else {
      ubicacionParrafo.textContent =
        "La geolocalización no está disponible en este navegador.";
    }
  }

  function obtenerPronosticoLluvia(latitude, longitude) {
    const apiKey = "80e51649ca0054038d08f10ffa6265c3";
    var url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=rain&timezone=auto&forecast_days=1`;
    resultadoParrafo.textContent = "Realizando la solicitud a la API...";

    fetch(url) //solicitud a la api
      .then((response) => {
        if (!response.ok) {
          //si no salio bien
          throw new Error("La solicitud no fue exitosa");
        }
        return response.json(); //convierte respuesta en objeto json
      })
      .then((data) => {
        mostrarPronosticoLluviaPorHoras(data); //llama a la funcion para mostrar las tarjetas con el pronostico de lluvia
      })
      .catch((error) => {
        //si falla
        resultadoParrafo.textContent =
          "Error al obtener el pronóstico: " + error.message;
      });
  }
});

//funcion para mostrar en tarjetas el pronostico de lluvia por hrs
function mostrarPronosticoLluviaPorHoras(data) {
  const resultadoDiv = document.getElementById("resultado"); // Obtiene el elemento div con el ID "resultado."

  if (data.hourly && data.hourly.rain && data.hourly.rain.length > 0) {
    // Verifica si hay datos de pronóstico de lluvia.
    const tiempos = data.hourly.time;
    const cantidadesLluvia = data.hourly.rain;

    for (let i = 0; i < tiempos.length; i++) {
      const tiempo = tiempos[i];
      const lluvia = cantidadesLluvia[i];
      // Crea una tarjeta (div) para mostrar la información.
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta";

      const contenidoTarjeta = document.createElement("p");
      contenidoTarjeta.textContent = `Día: ${tiempo}, Hora: ${tiempo}, Lluvia: ${lluvia} mm`;
      // Agrega el contenido a la tarjeta.
      tarjeta.appendChild(contenidoTarjeta);

      // Agrega la tarjeta al elemento "resultadoDiv."
      resultadoDiv.appendChild(tarjeta);
    }
  } else {
    resultadoDiv.textContent =
      "No se encontraron datos de lluvia en el pronóstico.";
  }
}
