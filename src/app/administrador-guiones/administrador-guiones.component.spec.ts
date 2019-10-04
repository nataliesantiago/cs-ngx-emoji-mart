import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorGuionesComponent } from './administrador-guiones.component';

describe('AdministradorGuionesComponent', () => {
  let component: AdministradorGuionesComponent;
  let fixture: ComponentFixture<AdministradorGuionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorGuionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorGuionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
