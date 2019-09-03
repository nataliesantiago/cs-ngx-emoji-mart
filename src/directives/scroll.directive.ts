import { Directive, ElementRef, Input, AfterViewInit, Output } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Conversacion } from '../schemas/conversacion.schema';

@Directive({
    selector: '[scrollDirective]'
})
export class ScrollDirective implements AfterViewInit {
    @Input() componentRef: PerfectScrollbarComponent;
    @Input() chat: Conversacion;
    primera_vez = true;
    constructor(el: ElementRef) {

    }

    ngAfterViewInit() {
        this.chat.messages.subscribe(m => {
            if (this.primera_vez) {
                this.primera_vez = false;
                this.chat.ocultar_nuevos_mensajes = true;
                this.componentRef.directiveRef.scrollToBottom();
                setTimeout(() => {
                    if (this.componentRef.directiveRef.position().y != 'end') {
                        this.componentRef.directiveRef.scrollToBottom();
                    }
                }, 1000);
            } else
                if (m && m.length > 0 && this.chat.mensajes && this.chat.mensajes.length > 0) {
                    if (this.componentRef.directiveRef.position().y === 'end') {
                        this.chat.ocultar_nuevos_mensajes = true;
                        this.componentRef.directiveRef.scrollToBottom();
                        setTimeout(() => {
                            if (this.componentRef.directiveRef.position().y != 'end') {
                                this.componentRef.directiveRef.scrollToBottom();
                            }
                        }, 400);
                    } else {
                        this.chat.ocultar_nuevos_mensajes = false;
                    }
                } else {
                    this.chat.ocultar_nuevos_mensajes = true;
                }
        })
    }
}