import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarChatExpertoComponent } from './cerrar-chat-experto.component';

describe('CerrarChatExpertoComponent', () => {
  let component: CerrarChatExpertoComponent;
  let fixture: ComponentFixture<CerrarChatExpertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarChatExpertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarChatExpertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
