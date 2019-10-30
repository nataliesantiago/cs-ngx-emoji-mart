import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialChatComponent } from './historial-chat.component';

describe('HistorialChatComponent', () => {
  let component: HistorialChatComponent;
  let fixture: ComponentFixture<HistorialChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
