import jstat from 'jstat';
const {jStat} = jstat;

//0. Funcion para generar numeros Telefonicos con 5 digitos
function generadorNumerosTelefonicos(cantidadNumeros) {
  let arregloNumerosTelefonicos = [];

  for( let i = 0; i < cantidadNumeros; i++ ) {
    let number = Math.floor(Math.random()*(99999));
    let numeroaCadena = number.toString().padStart(5,'0');
    arregloNumerosTelefonicos.push(numeroaCadena);
  }

  return arregloNumerosTelefonicos;
}

//1. funcion generadora de numeros pseudoaleatorios
function generadorCongruencialMultiplicativo(seed, k, g, cantidad) {
  const numerosAleatorios = [];
  let xn = seed;
  let a = 5 + 8 * k;
  let m = 2 ** g; // eg. 2^32 = 4294967296
  

  for (let i = 0; i < cantidad; i++) {
    xn = (a * xn) % m;
    numerosAleatorios.push(xn / (m - 1)); // Normalizar el valor a un número entre 0 y 1.
  }

  return numerosAleatorios;
}

//2. funcion para separar los 5 digitos decimales
function extraerDigitosPoker(numerosAleatorios) {
  const numerosTruncados = [];

  numerosAleatorios.forEach(numero => {
    numerosTruncados.push(numero.toFixed(5).substring(2));
  });

  return numerosTruncados;
}

//3. funcion para obtener la categoria de poker correspondiente
function extraerCategoria(valoresAleatorios) {
  let valoresCategorias = [];

  valoresAleatorios.forEach(valor => {
    let cuenta = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
    }

    for (let i in cuenta) {
      cuenta[i] = Array.from(valor.matchAll(i)).length;
    }

    valoresCategorias.push(Object.values(cuenta));
  });

  // Contar la cantidad de grupos de pares, trios, cuartetos, quintillas, y solitarios
  // y serializarlo en una cadena eg. "50000", "31000"
  let valoresTipoCategoria = [];
  valoresCategorias.forEach(valor => {
    let tipos = {
      '1': 0,     //solitarios
      '2': 0,     //pares
      '3': 0,     //trios
      '4': 0,     //cuartetos
      '5': 0      //quintillas
    }    

    for(let i in tipos) {
      tipos[i] = valor.filter((cantidad) => cantidad == i ).length;
    }

    valoresTipoCategoria.push(Object.values(tipos).join(''));
  });

  return valoresTipoCategoria;
}

//4. Funcion para contar la cantidad de tipos de grupo totales
function contarCategorias(arregloCategorias) {
  let tablaCategorias = {
    '50000' : {     
      'cantidad': 0,
      'abrev': 'TD' // todos diferentes
    },    
    '31000' : {     
      'cantidad': 0,
      'abrev': '1P' // un par
    },    
    '12000' : {     
      'cantidad': 0,
      'abrev': '2P' // dos pares
    },
    '01100' : {     
      'cantidad': 0,
      'abrev': 'TP' // trio y par
    },
    '20100' : {     
      'cantidad': 0,
      'abrev': 'T'  // un trio
    },
    '10010' : {     
      'cantidad': 0,
      'abrev': 'P'  // poker
    },
    '00001' : {     
      'cantidad': 0,
      'abrev': 'Q'  // quintilla
    },
  }

  for( let categoria in tablaCategorias ) {
    let cantidadTipo = arregloCategorias.filter((valor) => valor == categoria ).length;
    tablaCategorias[categoria].cantidad += cantidadTipo;
  }

  let tablaFinal = {}
  for( let categoria in tablaCategorias ) {
    tablaFinal[tablaCategorias[categoria].abrev] = tablaCategorias[categoria].cantidad;
  }

  return tablaFinal;
}

//5. Funcion final para devolver el resultado del algoritmo eg. Hipotesis nula aceptada
function Poker (numerosGenerados, cantidadNumeros, alpha, gradosLibertad) {
  //const numerosTruncados = extraerDigitosPoker(numerosGenerados);

  const valoresCategoria = extraerCategoria(numerosGenerados);

  const tablaCantObservadas = contarCategorias(valoresCategoria);

  let tablaProbEsperadas = {
    'TD' : 0.3024,
    '1P' : 0.5040,
    '2P' : 0.1080,
    'TP' : 0.0090,
    'T' : 0.0720,
    'P' : 0.0045,
    'Q' : 0.0001
  }

  let chicuadradoCalculado = 0;

  for( let categoria in tablaCantObservadas ) {
    let Ei = tablaProbEsperadas[categoria] * cantidadNumeros;
    let Oi = tablaCantObservadas[categoria];
    chicuadradoCalculado += ((Ei - Oi) ** 2 ) / Ei;
  }

  let chicuadradoTeorico = jStat.chisquare.inv( 1 - alpha, gradosLibertad - 1);

  console.log(`\n Xi = ${chicuadradoCalculado.toFixed(4)} ${chicuadradoCalculado < chicuadradoTeorico ? "<" : ">"} X_alpha = ${chicuadradoTeorico.toFixed(4)}\n`)
  
  chicuadradoCalculado < chicuadradoTeorico ? 
  console.log("Se acepta hipotesis nula: Los numeros son independientes") : 
  console.log("Se rechaza hipotesis nula: Los numeros NO son independientes");
}

// Uso del generador con una semilla, multiplicador y módulo específicos.
/*
const k = 6;
const g = 14;
const seed = 43125; // X[0] */

const cantidadNumeros = 50;

//Valores para algoritmo
const alpha = 0.05;
const gradosLibertad = 7;

//let numerosGenerados = generadorCongruencialMultiplicativo(seed, k, g, cantidadNumeros);

Poker(generadorNumerosTelefonicos(50), cantidadNumeros, alpha, gradosLibertad);