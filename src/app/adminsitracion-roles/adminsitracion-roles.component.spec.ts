import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsitracionRolesComponent } from './adminsitracion-roles.component';

describe('AdminsitracionRolesComponent', () => {
  let component: AdminsitracionRolesComponent;
  let fixture: ComponentFixture<AdminsitracionRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsitracionRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsitracionRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
