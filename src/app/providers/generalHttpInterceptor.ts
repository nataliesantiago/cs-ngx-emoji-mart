import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Cifrado } from "./cifrado";
import { UtilsService } from './utils.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private utilsService: UtilsService) {

    }
    cifrado: Cifrado = new Cifrado(this.utilsService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.utilsService.sendkey) {
           
        }
        if (req.method == 'GET') {
            let data = req.params.get('data');
            req = req.clone({ params: req.params.delete('data') });
            req = req.clone({ params: req.params.set('data', this.cifrado.enc(data)) });
            req = req.clone({ params: req.params.set('encrypt', '0') });
        }
        if (req.method == 'POST') {
            let data = req.body.data;
            data = this.cifrado.enc(JSON.stringify(data));
            req.body.data = data;
            req = req.clone({ body: req.body });
        }
        return next.handle(req).map(event => {
            if (event instanceof HttpResponse) {
                let body: any = this.cifrado.dec(event.body.data);
                try {
                    body = JSON.parse(body);
                } catch (e) {
                }
                return event.clone({
                    body: body
                });
            }
            return event;
        });
    }
};