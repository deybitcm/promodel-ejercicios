
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

const lambda = Math.trunc(calcularMedia(valoresAleatorios));
const numeroDatos = valoresAleatorios.length;

const numeroIntervalos = Math.trunc(Math.sqrt(numeroDatos));
const anchoIntervalo = Math.trunc(numeroDatos / numeroIntervalos);

const minimoValor = Math.min(...valoresAleatorios);
const maximoValor = Math.max(...valoresAleatorios);

console.log(calcularMedia(valoresAleatorios));
console.log(calcularVarianza(valoresAleatorios));

console.log(minimoValor, maximoValor);
