// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_BACK: 'http://localhost:8080/api/',
  CLIENT_ID: '993073337079-0qt03a4l3pk7psfnpk1nto8m5bt14vnt.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  APIKEY: 'AIzaSyBEKRnunoggWof_mmJDfHRG9-fgKYfYOF8',
  APPID: '537955814682',
  firebaseConfig: {
    apiKey: "AIzaSyBEKRnunoggWof_mmJDfHRG9-fgKYfYOF8",
    authDomain: "comusoporte-desarrollo.firebaseapp.com",
    databaseURL: "https://comusoporte-desarrollo.firebaseio.com",
    projectId: "comusoporte-desarrollo",
    storageBucket: "",
    messagingSenderId: "537955814682",
    appId: "1:537955814682:web:b726049a21de1c69"
  },
  ambiente: 'col',
  pais: {
    col: {
      id_origen_conecta: 'datasources/2721fbfe980dfcd21c1c5aece9cacef5',
      id_origen_drive: 'datasources/2721fbfe980dfcd20dfd92cb9961df38',
      id_origen_chat: 'datasources/2721fbfe980dfcd221c70095e8d11769'
    }
  },
  analytics: `<script  src="https://www.googletagmanager.com/gtag/js?id=G-CK3PS915EF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-CK3PS915EF');
  </script>`

};

