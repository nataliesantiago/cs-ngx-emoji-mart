var moment = require('moment-timezone');
class Mensaje {
    id_usuario;
    tipo_mensaje;
    url;
    es_archivo;
    es_nota_voz;
    fecha_mensaje;
    intencion_mensaje;
    constructor(id_usuario, tipo_mensaje, url) {
        this.id_usuario = id_usuario;
        this.tipo_mensaje = tipo_mensaje;
        this.url = url;
        this.fecha_mensaje = moment();
    }
}
module.exports = Mensaje;