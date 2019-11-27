// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  URL_BACK: 'http://localhost:8080/api/',
  CLIENT_ID: '426288128680-qfderp9ncl2fru7o5jq0n43b9dq82bf2.apps.googleusercontent.com', //id de cliente de google para la aplicacion
  APIKEY: 'AIzaSyA1gxXCglazlny7FVA2MKrRRmxpPzwRp4I',
  APPID: '426288128680',
  firebaseConfig: {
    apiKey: "AIzaSyA1gxXCglazlny7FVA2MKrRRmxpPzwRp4I",
    authDomain: "comusoporte-laboratorio.firebaseapp.com",
    databaseURL: "https://comusoporte-laboratorio.firebaseio.com",
    projectId: "comusoporte-laboratorio",
    storageBucket: "comusoporte-laboratorio.appspot.com",
    messagingSenderId: "426288128680",
    appId: "1:426288128680:web:6d99fafbc1bc7baff0189d",
    measurementId: "G-58GFQXDJLF"
  },
  ambiente: 'col',
  pais: {
    col: {
      id_origen_conecta: 'datasources/2721fbfe980dfcd21c1c5aece9cacef5',
      id_origen_drive: 'datasources/2721fbfe980dfcd20dfd92cb9961df38',
      id_origen_chat: 'datasources/2721fbfe980dfcd221c70095e8d11769'
    }
  },
  analytics: `<script async src="https://www.googletagmanager.com/gtag/js?id=CK3PS915EF"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'CK3PS915EF');
  </script>`
};

