import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorHorariosComponent } from './administrador-horarios.component';

describe('AdministradorHorariosComponent', () => {
  let component: AdministradorHorariosComponent;
  let fixture: ComponentFixture<AdministradorHorariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorHorariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
