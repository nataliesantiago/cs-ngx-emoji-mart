// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_BACK: 'https://davivienda-comunidades-col-dev.appspot.com/api/',
  CLIENT_ID: '993073337079-0qt03a4l3pk7psfnpk1nto8m5bt14vnt.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  firebaseConfig: {
    apiKey: "AIzaSyCk1WFHTdfSmhcH63_iGZU_s3AvwiQI_RU",
    authDomain: "davivienda-comunidades-col-dev.firebaseapp.com",
    databaseURL: "https://davivienda-comunidades-col-dev.firebaseio.com",
    projectId: "davivienda-comunidades-col-dev",
    storageBucket: "davivienda-comunidades-col-dev.appspot.com",
    messagingSenderId: "993073337079",
    appId: "1:993073337079:web:4dc46bec7c927ec7"
  }
};

