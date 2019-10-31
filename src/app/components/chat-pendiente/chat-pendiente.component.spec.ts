import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPendienteComponent } from './chat-pendiente.component';

describe('ChatPendienteComponent', () => {
  let component: ChatPendienteComponent;
  let fixture: ComponentFixture<ChatPendienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPendienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPendienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
