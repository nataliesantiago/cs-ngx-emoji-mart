import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorLookFeelComponent } from './administrador-look-feel.component';

describe('AdministradorLookFeelComponent', () => {
  let component: AdministradorLookFeelComponent;
  let fixture: ComponentFixture<AdministradorLookFeelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorLookFeelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorLookFeelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
