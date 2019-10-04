import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdMotivoCierreChatComponent } from './ad-motivo-cierre-chat.component';

describe('AdMotivoCierreChatComponent', () => {
  let component: AdMotivoCierreChatComponent;
  let fixture: ComponentFixture<AdMotivoCierreChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdMotivoCierreChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdMotivoCierreChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
