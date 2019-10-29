import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorOrigenesDriveComponent } from './administrador-origenes-drive.component';

describe('AdministradorOrigenesDriveComponent', () => {
  let component: AdministradorOrigenesDriveComponent;
  let fixture: ComponentFixture<AdministradorOrigenesDriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorOrigenesDriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorOrigenesDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
