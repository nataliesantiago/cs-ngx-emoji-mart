import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPreguntasComponent } from './formulario-preguntas.component';

describe('FormularioPreguntasComponent', () => {
  let component: FormularioPreguntasComponent;
  let fixture: ComponentFixture<FormularioPreguntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioPreguntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
