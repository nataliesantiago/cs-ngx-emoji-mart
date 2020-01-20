// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_BACK: 'https://comusoportecam-produccion.appspot.com/api/',
  CLIENT_ID: '945105371213-csv59pllqu99c4t3ltnal1915cc3mg61.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  APIKEY: 'AIzaSyDOgOkyOuWaq4Z0YVzNuUPpcJD1DG4ZWBE',
  APPID: '269068096594',
  firebaseConfig: {
    apiKey: "AIzaSyDOgOkyOuWaq4Z0YVzNuUPpcJD1DG4ZWBE",
    authDomain: "comusoportecam-produccion.firebaseapp.com",
    databaseURL: "https://comusoportecam-produccion.firebaseio.com",
    projectId: "comusoportecam-produccion",
    storageBucket: "comusoportecam-produccion.appspot.com",
    messagingSenderId: "269068096594",
    appId: "1:269068096594:web:d1876c2d13325ef4bcbb8b"
  },
  ambiente: 'cam',
  pais: {
    pan: {
      id_origen_conecta: 'datasources/c039757a44e91d2bb4b98465235e9c9d',
      id_origen_drive: 'datasources/c039757a44e91d2bf60199c0684f8268',
      id_origen_chat: 'datasources/c039757a44e91d2b31313e7e4a465851'
    }
  },
  analytics: 'G-BVSYD26YKY',
  enckey:'DvC1=2D4ns3n&41R0mpRr?¿'
};