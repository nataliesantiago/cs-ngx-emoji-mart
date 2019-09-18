import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioExpertizComponent } from './formulario-expertiz.component';

describe('FormularioExpertizComponent', () => {
  let component: FormularioExpertizComponent;
  let fixture: ComponentFixture<FormularioExpertizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioExpertizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioExpertizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
