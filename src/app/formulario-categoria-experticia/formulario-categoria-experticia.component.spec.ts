import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCategoriaExperticiaComponent } from './formulario-categoria-experticia.component';

describe('FormularioCategoriaExperticiaComponent', () => {
  let component: FormularioCategoriaExperticiaComponent;
  let fixture: ComponentFixture<FormularioCategoriaExperticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioCategoriaExperticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCategoriaExperticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
