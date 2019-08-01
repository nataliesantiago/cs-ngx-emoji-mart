import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private autenticationService: AutenticationService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.isAuthenticated()) {
            if (this.autenticationService.validStatus()) {
                //this.autenticationService.logout();
                //this.router.navigate(['']);
                return true;
            } else {
                console.log('No esta autenticado');
                return false;
            }
        }
        console.log('no esta autenticado');
        /*   */
        //this.router.navigate(['/login']);
        this.autenticationService.signInWithGoogle();
        return false;
    }

    isAuthenticated() {
        if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token').toString() !== '') {
            return true;
        }
        return false;
    }
}
