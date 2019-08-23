import { Directive, ElementRef, Input, AfterViewInit, Output } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Conversacion } from '../schemas/conversacion.schema';

@Directive({
    selector: '[scrollDirective]'
})
export class ScrollDirective implements AfterViewInit {
    @Input() componentRef: PerfectScrollbarComponent;
    @Input() chat: Conversacion;
    constructor(el: ElementRef) {

    }

    ngAfterViewInit() { 
        this.chat.messages.subscribe(m => {
            if (m && m.length > 0 && this.chat.mensajes && this.chat.mensajes.length > 0) {
                if (this.componentRef.directiveRef.position().y === 'end') {
                    setTimeout(() => {
                        this.chat.ocultar_nuevos_mensajes = true;
                        this.componentRef.directiveRef.scrollToBottom();
                    }, 5 * m.length);
                } else {
                    this.chat.ocultar_nuevos_mensajes = false;
                }
            } else {
                this.chat.ocultar_nuevos_mensajes = true;
            }
        })
    }
}