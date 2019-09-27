import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioExpertoComponent } from './formulario-experto.component';

describe('FormularioExpertoComponent', () => {
  let component: FormularioExpertoComponent;
  let fixture: ComponentFixture<FormularioExpertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioExpertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioExpertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
