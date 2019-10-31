import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoDetalleChatComponent } from './dialogo-detalle-chat.component';

describe('DialogoDetalleChatComponent', () => {
  let component: DialogoDetalleChatComponent;
  let fixture: ComponentFixture<DialogoDetalleChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoDetalleChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoDetalleChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
