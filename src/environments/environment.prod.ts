// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  URL_BACK: 'http://comusoporte-produccion.appspot.com/api/',
  CLIENT_ID: '157185516619-i8f1ja653q3fgvpnin3b1hvdl3199dvj.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  APIKEY: 'AIzaSyAmEXq-6U5ZvYzuYyfP1EIs5BfqBj_Sy1A',
  APPID: '157185516619',
  firebaseConfig: {
    apiKey: "AIzaSyAmEXq-6U5ZvYzuYyfP1EIs5BfqBj_Sy1A",
    authDomain: "comusoporte-produccion.firebaseapp.com",
    databaseURL: "https://comusoporte-produccion.firebaseio.com",
    projectId: "comusoporte-produccion",
    storageBucket: "comusoporte-produccion.appspot.com",
    messagingSenderId: "157185516619",
    appId: "1:157185516619:web:dcbf61159e8f0cebe999ce",
    measurementId: "G-LD9HD2CX2L"
  },
  ambiente: 'col',
  pais: {
    col: {
      id_origen_conecta: 'datasources/2721fbfe980dfcd24289f0dbfe458285',
      id_origen_drive: 'datasources/2721fbfe980dfcd2893b8efb36855a7a',
      id_origen_chat: 'datasources/2721fbfe980dfcd26b2de43b9fdf90ea'
    }
  },
  analytics: 'UA-151598857-2',
  enckey:'DvC1=2D4ns3n&41R0mpRr?¿'
};

