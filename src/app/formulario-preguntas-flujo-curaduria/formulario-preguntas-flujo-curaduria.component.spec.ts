import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPreguntasFlujoCuraduriaComponent } from './formulario-preguntas-flujo-curaduria.component';

describe('FormularioPreguntasFlujoCuraduriaComponent', () => {
  let component: FormularioPreguntasFlujoCuraduriaComponent;
  let fixture: ComponentFixture<FormularioPreguntasFlujoCuraduriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioPreguntasFlujoCuraduriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPreguntasFlujoCuraduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
