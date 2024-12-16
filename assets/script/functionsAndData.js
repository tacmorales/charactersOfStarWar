//Desde esta URL base se hacen las peticiones, solo falta agregar el Id de un personaje para consultar
export const urlBase = "https://swapi.tech/api/people/";

export let template = document.querySelector("#characterCard");

//Contador que va desde from hasta until
export function* counter(from, until) {
    let i = from;
    for (i; i <= until; i++) {
      yield i;
    }
    return "end"
  }

//Sections que luego se le asigna a cada section un contador que va desde firstId (from), hasta lastId (until) 
export let sections = {
  "first-group": {
    firstId: 1,
    lastId: 5,
    
  },
  "second-group": {
    firstId: 6,
    lastId: 10,
  },
  "third-group": {
    firstId: 11,
    lastId: 15,
  },
  "fourth-group": {
    firstId: 16,
    lastId: 20,
  },
};
//Se guarda en cada grupo un contador que va desed su firstId hasta lastId
for (let section in sections) {
  sections[section].counter = counter(
    sections[section].firstId,
    sections[section].lastId
  );
}

export const animationFrames =       [
  { opacity: "0" , transform: "scale(0)" },
  { opacity: "1" , transform: "scale(1)" },
]

//Revisa si el documento ya cargo. Si cargó llama a la funcion "aFunction"
export function ready(aFunction) {
  if (document.readyState !== "loading") {
    aFunction();
  } else {
    document.addEventListener("DOMContentLoaded", aFunction);
  }
}