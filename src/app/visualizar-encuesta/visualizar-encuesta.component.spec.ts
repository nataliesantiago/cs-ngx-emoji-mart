import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEncuestaComponent } from './visualizar-encuesta.component';

describe('VisualizarEncuestaComponent', () => {
  let component: VisualizarEncuestaComponent;
  let fixture: ComponentFixture<VisualizarEncuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarEncuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
