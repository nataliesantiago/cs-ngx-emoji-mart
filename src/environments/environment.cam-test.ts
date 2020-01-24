// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_BACK: 'https://comusoportecam-desarrollo.appspot.com/api/',
  CLIENT_ID: '659384240459-jfjf9poq9fra3focm0hajoalvnbcu525.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  APIKEY: 'AIzaSyAx-GuSyaatybFcHxajdLBo9pcU7UYwP98',
  APPID: '659384240459',
  firebaseConfig: {
    apiKey: "AIzaSyAx-GuSyaatybFcHxajdLBo9pcU7UYwP98",
    authDomain: "comusoportecam-desarrollo.firebaseapp.com",
    databaseURL: "https://comusoportecam-desarrollo.firebaseio.com",
    projectId: "comusoportecam-desarrollo",
    storageBucket: "",
    messagingSenderId: "659384240459",
    appId: "1:659384240459:web:5c39de166992d5aa"
  },
  ambiente: 'cam',
  pais: {
    pan: {
      id_origen_conecta: 'datasources/c039757a44e91d2bb4b98465235e9c9d',
      id_origen_drive: 'datasources/c039757a44e91d2bf60199c0684f8268',
      id_origen_chat: 'datasources/c039757a44e91d2b31313e7e4a465851'
    }
  },
  analytics: 'UA-151598857-3',
  enckey:'DvC1=2D4ns3n&41R0mpRr?¿'
};