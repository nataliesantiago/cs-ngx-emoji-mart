import { Conversacion } from "./conversacion.schema";


export interface xhrConversaciones {
    success: boolean;
    conversaciones: Array<any>
}

export interface xhrFilasExperto {
    success: boolean;
    filas: Array<any>
}

export interface Experto {
    idtbl_usuario:number;
    activo:boolean;
    chats:Array<any>;
}


export class xhr {
    success: boolean;
    constructor() { }
}