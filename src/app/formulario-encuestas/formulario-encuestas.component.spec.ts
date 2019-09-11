import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEncuestasComponent } from './formulario-encuestas.component';

describe('FormularioEncuestasComponent', () => {
  let component: FormularioEncuestasComponent;
  let fixture: ComponentFixture<FormularioEncuestasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioEncuestasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
