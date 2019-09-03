import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsitradorExtensionesChatComponent } from './adminsitrador-extensiones-chat.component';

describe('AdminsitradorExtensionesChatComponent', () => {
  let component: AdminsitradorExtensionesChatComponent;
  let fixture: ComponentFixture<AdminsitradorExtensionesChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsitradorExtensionesChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsitradorExtensionesChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
