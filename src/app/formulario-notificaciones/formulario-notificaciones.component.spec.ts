import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioNotificacionesComponent } from './formulario-notificaciones.component';

describe('FormularioNotificacionesComponent', () => {
  let component: FormularioNotificacionesComponent;
  let fixture: ComponentFixture<FormularioNotificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioNotificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
