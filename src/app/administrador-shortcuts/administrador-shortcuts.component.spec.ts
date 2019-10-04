import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorShortcutsComponent } from './administrador-shortcuts.component';

describe('AdminsitradorShortcutsComponent', () => {
  let component: AdministradorShortcutsComponent;
  let fixture: ComponentFixture<AdministradorShortcutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorShortcutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorShortcutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
