import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorNotificacionesComponent } from './administrador-notificaciones.component';

describe('AdministradorNotificacionesComponent', () => {
  let component: AdministradorNotificacionesComponent;
  let fixture: ComponentFixture<AdministradorNotificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorNotificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
