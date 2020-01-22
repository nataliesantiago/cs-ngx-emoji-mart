import { Conversacion } from "./conversacion.schema";
import { Modulo } from "./interfaces";


export class User {
    idtbl_usuario: number;
    correo: string;
    token_acceso: string;
    nombre: string;
    tbl_estado: number;
    rol_usuario: number;
    url_foto: string;
    id_oficina_actual: number;
    super_admin = false;
    public isSignedIn: boolean = false;
    estado = { id: 0, nombre: '' };
    id_perfil: number;
    estado_experto: number = 1;
    experto_activo: boolean = true;
    nombre_perfil: string;
    nombre_rol: string;
    filas: Array<any>;
    url_imagen_gsuite: string;
    id_rol: number;
    codigo_firebase: string;
    pass_firebase: string;
    conversacion_experto: Conversacion;
    activo_chat: boolean;
    modo_nocturno: number;
    peso_chat: number;
    estado_actual: number;
    pais: string;
    modulos: Array<Modulo>;
    boton_sos_perfil: boolean;
    boton_sos_rol: boolean;
    estado_actual_experto: string;
    atendiendo_emergencia: boolean;

    constructor(correo: string, token: string, nombre: string) {
        this.correo = correo;
        this.token_acceso = token;
        this.nombre = nombre;
    }

    public setId(id: number) {
        this.idtbl_usuario = id;
    }

    public getId() {
        return this.idtbl_usuario;
    }

    public setEstado(e: number) {
        this.tbl_estado = e;
    }

    public setToken(t: string) {
        this.token_acceso = t;
    }

    public setSignedIn(i: boolean) {
        this.isSignedIn = i;
    }

    public getSignedIn() {
        return this.isSignedIn;
        // return this.isSignedIn;
    }

    public setOficinas(o) {

    }
    public getCorreo() {
        return this.correo;
    }

    public getEmail() {
        return this.correo;
    }

    public setSuperAdmin(s) {
        this.super_admin = s;
    }

    public getSuperAdmin() {
        return this.super_admin;
    }

    public setEstadoUsuario(e) {
        this.estado = e;
    }

    public getEstadoUsuario() {
        return this.estado;
    }

    public getOficina() {
        return this.id_oficina_actual;
    }
    public getIdPerfil(): number {
        return this.id_perfil;
    }
    public setIdPerfil(value: number) {
        this.id_perfil = value;
    }

    public getIdRol(): number {
        return this.id_rol;
    }
    public setIdRol(value: number) {
        this.id_rol = value;
    }

    public getPesoChat(): number {
        return this.peso_chat;
    }
    public setPesoChat(value: number) {
        this.peso_chat = value;
    }

    public getNombrePerfil(): string {
        return this.nombre_perfil;
    }

    public getNombreRol(): string {
        return this.nombre_rol;
    }
    public setNombreRol(value: string) {
        this.nombre_rol = value;
    }
    public setNombrePerfil(value: string) {
        this.nombre_perfil = value;
    }
    public setModoNocturno(value: number) {
        this.modo_nocturno = value;
    }
    public getModoNocturno(): number {
        return this.modo_nocturno;
    }

    public getNombre(): string {
        return this.nombre;
    }
    public setNombre(value: string) {
        this.nombre = value;
    }

    public getUrlFoto(): string {
        return this.url_foto;
    }
    public setUrlFoto(value: string) {
        this.url_foto = value;
    }
    public getEstadoExpertoActual(): number {
        return this.estado_actual;
    }
    public setEstadoExpertoActual(value: number) {
        this.estado_actual = value;
    }
}