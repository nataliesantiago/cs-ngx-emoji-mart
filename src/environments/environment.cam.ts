// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    URL_BACK: 'http://localhost:8080/api/',
    CLIENT_ID: '659384240459-jfjf9poq9fra3focm0hajoalvnbcu525.apps.googleusercontent.com', //id de cliente de google para la aplicacion
    firebaseConfig: {
        apiKey: "AIzaSyAx-GuSyaatybFcHxajdLBo9pcU7UYwP98",
        authDomain: "comusoportecam-desarrollo.firebaseapp.com",
        databaseURL: "https://comusoportecam-desarrollo.firebaseio.com",
        projectId: "comusoportecam-desarrollo",
        storageBucket: "",
        messagingSenderId: "659384240459",
        appId: "1:659384240459:web:5c39de166992d5aa"
    },
    ambiente: 'cam'
  };