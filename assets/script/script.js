import {
    urlBase,
    template,
    sections,
    animationFrames,
    ready,
} from "./functionsAndData.js";

const show1Character = async (e) => {
    //La tarjeta principal, con la que funciona la interacción (las primeras con título "En esta sección")
    const mainCard = e.target;
    //Selecciona la fila donde se coloca el personaje y se captura el id de este grupo (El id de cada contenedor que representa una sección en el HTML)
    const groupName = mainCard.parentNode.parentNode.id;
    //Se ocupa el nombre de este grupo como llave dentro del objeto sections (Se usaron los ids de los contenedores para los nombres en el diccionario sections creado en functionsAndData )
    const section = sections[groupName];
    //El elemento obtenido del diccionario sections, section, tiene un next() que permite solicitar el siguiente número entre sus propiedades firstId y lastId.
    const count = section.counter.next();
    //Verifica si ya termino el conteo. Si terminó, la función se detiene.
    if (count.done) return;
    
    //Comienza la carga, entonces se cambia el color del circulo a gris para indicar que esta cargando 1 personaje.
    mainCard.querySelector(".circle-inside").classList.add("loading");
    
    //Se recupera el valor que devolvió el contador.
    const characterId = count.value;
    //Obtiene un personaje a partir del id
    const characterJsonFormat = await get1Character(characterId);
    //Se crea la tarjeta el personaje en la pantalla del id
    const card = createElementCard(characterJsonFormat, characterId)
    //Selecciona la fila donde se coloca el personaje y se captura el id de este grupo
    const row = e.target.parentNode;
    
    //Vuelve su color original del circulo de la tarjeta principal
    mainCard.querySelector(".circle-inside").classList.remove("loading");

    //Se captura la tarjeta a colocar
    let newCard = card.children[0];
    //Se coloca en el arbol del DOM
    row.append(card);
    //Se anima la tarjeta que se colocó (Debe cumplirse ese orden, primero append, luego animate)
    newCard.animate(animationFrames, { duration: 200 });


    //Si es el último personaje en cargar, cambia la tarjeta
    if (count.value === section.lastId) {
        mainCard.querySelector(".circle-inside").textContent = "✓";
        mainCard.querySelector("h2").textContent = "Todos...";
        mainCard.querySelector("p").textContent =
            "los personajes de esta sección ya han sido desplegados.";
    }
};

const get1Character = async (characterId) => {
    let characterJsonFormat;
    try {
        const endpointToConsult = `${urlBase}${characterId}`;
        const answer = await fetch(endpointToConsult);
        checkIfFetchAnswerIsOk(answer, characterId)
        //Se captura al personaje si no hay problema con la consulta fetch
        characterJsonFormat = await answer.json();
    } catch (error) {
        //Se muestra el error que podria ocurrir
        console.log(`${error}`);
        //Declarativamente se indica que no hay personaje
        characterJsonFormat = null;
    }
    finally {
        return characterJsonFormat.result.properties;
    }
}

const checkIfFetchAnswerIsOk = (answer, characterId) => {
    if (!answer?.ok) {
        throw new Error(
            `Al consultar el Id ${characterId} la respuesta devolvió el estado ${answer.status}`
        );
    }
}

const createElementCard = (characterJsonFormat, characterId) => {
    console.log(`createElementCard() -> characterJsonFormat: ${characterJsonFormat}`)
    //Se hace una copia del template de "character card" o tarjeta de personaje
    const clone = template.content.cloneNode(true);
    //Se coloca el Id en el circulo
    clone.querySelector(".circle-inside").textContent = characterId;

    //Si el personaje existe
    if (characterJsonFormat) {
        let characterName = characterJsonFormat.name;
        let characterMeasurements = `Altura: ${
            characterJsonFormat.height
        }cm Peso: ${String(characterJsonFormat.mass).replace(",", ".")}kg `;
        //En el titulo el nombre del personaje y en el parrafo las medidas del personaje.
        clone.querySelector("h3").textContent = characterName;
        clone.querySelector("p").textContent = characterMeasurements;
    } else {
        // Si el personaje es null, por algun error,
        clone.querySelector("h3").textContent = "Error";
        clone.querySelector("p").textContent =
            "Ver la consola para averiguar el error.";
        //lo pinta distinto para resaltar que es un error
        clone.children[0].classList.add("error");
    }
    return clone;
};

ready(() => {
    /*Cuando el DOM está listo, se asigna la función show1Character al evento que provoca consultar por un nuevo personaje de la api*/
    document
        .querySelectorAll(".main-card")
        .forEach((card) => card.addEventListener("mouseenter", show1Character));
});
