

export class User {
    idtbl_usuario: number;
    correo: string;
    token_acceso: string;
    nombre: string;
    tbl_estado: number;
    rol_usuario: number;
    
    id_oficina_actual: number;
    super_admin = false;
    public isSignedIn: boolean = false;
    estado = { id: 0, nombre: '' };
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

    public getIdPerfil() {
        return this.rol_usuario;
    }



}