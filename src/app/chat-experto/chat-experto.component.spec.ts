import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatExpertoComponent } from './chat-experto.component';

describe('ChatExpertoComponent', () => {
  let component: ChatExpertoComponent;
  let fixture: ComponentFixture<ChatExpertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatExpertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatExpertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
