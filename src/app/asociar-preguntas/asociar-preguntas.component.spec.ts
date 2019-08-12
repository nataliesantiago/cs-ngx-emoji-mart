import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarPreguntasComponent } from './asociar-preguntas.component';

describe('AsociarPreguntasComponent', () => {
  let component: AsociarPreguntasComponent;
  let fixture: ComponentFixture<AsociarPreguntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsociarPreguntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
