export const environment = {
    production: false,
    URL_BACK: 'http://localhost:8080/api/',
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
            id_origen_conecta: 'datasources/c039757a44e91d2b7d8c5e420efe2556',
            id_origen_drive: 'datasources/c039757a44e91d2baaea0db7d0805052',
            id_origen_chat: 'datasources/c039757a44e91d2bb89d21564d5d1834'
        },
        sal: {
            id_origen_conecta: 'datasources/f45e1c58b9ab7a3d2ee5605e37eca67e',
            id_origen_drive: 'datasources/f45e1c58b9ab7a3d7c09343ac8e08b6b',
            id_origen_chat: 'datasources/f45e1c58b9ab7a3ddf98e4fe0a3072d0'
        },
        cos: {
            id_origen_conecta: 'datasources/711772214966c48c4850b5eae883cc60',
            id_origen_drive: 'datasources/f45e1c58b9ab7a3d7c09343ac8e08b6b',
            id_origen_chat: 'datasources/711772214966c48cb619b47ffe040b04'
        },
        hon: {
            id_origen_conecta: 'datasources/45c0c1d1bb4100dc052b6c522007f8a6',
            id_origen_drive: 'datasources/45c0c1d1bb4100dcab33bc338b90a9d0',
            id_origen_chat: 'datasources/45c0c1d1bb4100dc4be3e54d1f42fbb3'
        }
    },
    analytics: 'G-BVSYD26YKY',
    ajax: 'DvC1=2D4ns3n&41R0mpRr?¿',
    tableros: {
        cos: {
            buscador: '',
            chatExperto: ''
        },
        sal: {
            buscador: '',
            chatExperto: ''
        },
        hon: {
            buscador: '',
            chatExperto: ''
        },
        pan: {
            buscador: '',
            chatExperto: ''
        },
    }
};