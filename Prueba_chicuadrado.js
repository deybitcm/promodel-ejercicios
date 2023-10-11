
const valoresAleatorios = [
  18.799,14.889,20.977,25.106,24.793,26.933,11.266,19.063,24.38,15.653,17.239,13.238,12.612,16.089,16.906,11.528,17.728,18.384,20.539,18.538,18.692,18.519,25.371,19.659,19.255,17.947,27.889,23.463,29.503,17.38,26.646,13.55,22.156,23.609,27.676,19.662,17.905,22.701,18.475,23.03,14.223,16.611,13.914,18.548,19.87,20.112,18.709,28.778,13.03,17.054,9.69,25.791,14.881,17.386,23.031,21.867,23.498,22.383,14.513,15.537,22.776,21.291,16.241,19.036,20.526,22.231,20.555,16.356,27.539,21.949,20.289,23.319,23.448,17.454,16.307,24.445,15.195,13.764,22.845,22.554,28.823,25.775,25.216,20.452,20.008,21.815,19.898,15.781,12.901,3.313,21.777,22.472,20.854,15.892,24.953,18.755,16.64,16.715,18.284,18.187
];

function calcularMedia(datos) {
  const suma = datos.reduce((acumulador, valor) => acumulador + valor, 0);
  return suma / datos.length;
}

function calcularVarianza(datos) {
  // Paso 1: Calcular la media
  const media = calcularMedia(datos);

  // Paso 2 y 3: Calcular la suma de las diferencias al cuadrado
  const diferenciasAlCuadrado = datos.map((valor) => Math.pow(valor - media, 2));

  // Paso 4: Calcular la varianza (promedio de las diferencias al cuadrado)
  const varianza = calcularMedia(diferenciasAlCuadrado);

  return varianza;
}

function calcularDesviacionEstandar(data, media) {
  const sumatoriaCuadrados = data.reduce((acumulador, valor) => acumulador + Math.pow(valor - media, 2), 0);
  return Math.sqrt(sumatoriaCuadrados / (data.length - 1));
}

function calcularProbabilidadPoisson(lambda, k) {
  // Calcula e^-lambda
  const eLambda = Math.exp(-lambda);

  // Calcula lambda^k
  const lambdaPowK = Math.pow(lambda, k);

  // Calcula k factorial (k!)
  const factorialK = factorial(k);

  // Calcula la probabilidad P(X = k)
  const probabilidad = (eLambda * lambdaPowK) / factorialK;

  return probabilidad;
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function recorrerIntervaloPoisson(indInferior, indSuperior, lambda) {
  let suma = 0;
  for( let i = indInferior; i <= indSuperior; i++) {
    suma += calcularProbabilidadPoisson(lambda, i);
  }
  return suma;
}

function recorrerIndicesIntervalos(datos) {
  let lambda = Math.trunc(calcularMedia(datos));
  let numeroDatos = datos.length;

  let minimoValor = Math.trunc(Math.min(...datos)) + 1;
  let maximoValor = Math.trunc(Math.max(...datos));

  let numeroIntervalos = Math.trunc(Math.sqrt(numeroDatos));
  let anchoIntervalo = Math.trunc( (maximoValor - minimoValor) / numeroIntervalos) + 1;

  let listaIntervalos = [];

  let indInf= 0;
  let indSup = -1;
  let indAux = minimoValor;
  let nuevoIntervalo = [0,0];

  for ( let i = 1; i <= numeroIntervalos; i++) {
    if( i == 1 ) nuevoIntervalo = [indInf, minimoValor];
    else if( i == numeroIntervalos ) nuevoIntervalo = [maximoValor, indSup];
    else nuevoIntervalo = [indAux, indAux+=anchoIntervalo];

    listaIntervalos.push(nuevoIntervalo);
  }
}

console.log(calcularMedia(valoresAleatorios));
console.log(calcularVarianza(valoresAleatorios));

recorrerIndicesIntervalos(valoresAleatorios);




// Función para calcular la prueba de chi-cuadrado para ajuste a una distribución normal
function chiSquaredNormalTest(data) {
  // Paso 1: Ordenar los datos ascendentemente
  const sortedData = data.slice().sort((a, b) => a - b);

  // Paso 2: Calcular la media y la desviación estándar de los datos
  const media = calcularMedia(sortedData);
  const desviacionEstandar = calcularDesviacionEstandar(sortedData, media);

  // Paso 3: Dividir los datos en intervalos y contar las frecuencias observadas
  const intervalos = 10; // Número de intervalos (puedes ajustarlo)
  const frecuenciasObservadas = [];
  const intervaloAncho = (sortedData[sortedData.length - 1] - sortedData[0]) / intervalos;

  let intervaloInicio = sortedData[0];
  for (let i = 0; i < intervalos; i++) {
    const intervaloFin = intervaloInicio + intervaloAncho;
    const frecuencia = sortedData.filter((valor) => valor >= intervaloInicio && valor < intervaloFin).length;
    frecuenciasObservadas.push(frecuencia);
    intervaloInicio = intervaloFin;
  }

  // Paso 4: Calcular las frecuencias esperadas para una distribución normal
  const frecuenciasEsperadas = frecuenciasObservadas.map((frecuencia) =>
    calcularFrecuenciaEsperada(media, desviacionEstandar, intervaloAncho, frecuencia)
  );

  // Paso 5: Calcular el estadístico de chi-cuadrado
  const chiSquared = calcularChiSquared(frecuenciasObservadas, frecuenciasEsperadas);

  // Paso 6: Calcular los grados de libertad
  const gradosLibertad = intervalos - 3; // 3 parámetros (media, desviación estándar y ajuste de intervalos)

  // Paso 7: Consultar la tabla de chi-cuadrado o utilizar software para obtener el valor crítico

  // Paso 8: Comparar el valor calculado con el valor crítico y tomar una decisión

  return { chiSquared, gradosLibertad };
}

function calcularFrecuenciaEsperada(media, desviacionEstandar, intervaloAncho, frecuenciaObservada) {
  const z1 = (intervaloAncho / 2 - media) / desviacionEstandar;
  const z2 = (-intervaloAncho / 2 - media) / desviacionEstandar;
  return (calcularFuncionDistribucionNormal(z2) - calcularFuncionDistribucionNormal(z1)) * data.length;
}

function calcularFuncionDistribucionNormal(z) {
  // Puedes utilizar una función o tabla de valores acumulados para la distribución normal
  // Aquí se usa una función de aproximación.
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.398942280401 * Math.exp(-z * z / 2);
  const p = 0.319381530 * t - 0.356563782 * t * t + 1.781477937 * t * t * t - 1.821255978 * t * t * t * t + 1.330274429 * t * t * t * t * t;
  if (z > 0) {
    return 1 - d * p;
  } else {
    return d * p;
  }
}

function calcularChiSquared(observed, expected) {
  return observed.reduce((acumulador, frecuenciaObservada, index) => {
    const frecuenciaEsperada = expected[index];
    const diferenciaCuadrado = Math.pow(frecuenciaObservada - frecuenciaEsperada, 2);
    return acumulador + (diferenciaCuadrado / frecuenciaEsperada);
  }, 0);
}

// Ejemplo de uso
const datos = [67, 70, 70, 72, 73, 74, 75, 75, 76, 78, 80, 80, 81, 82, 83, 84, 85, 86, 87, 89]; // Tus datos

const resultado = chiSquaredNormalTest(datos);
console.log("Estadístico de chi-cuadrado:", resultado.chiSquared);
console.log("Grados de libertad:", resultado.gradosLibertad);
