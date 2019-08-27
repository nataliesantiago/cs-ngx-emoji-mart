import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SonidosService {
  private sonidoSubject: Subject<any> = new Subject();
  public sonidoObserver: Observable<any> = this.sonidoSubject.asObservable();
  constructor() { }

  sonar(tipo: number) {
    this.sonidoSubject.next(tipo);
  }

}
