import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaChatComponent } from './transferencia-chat.component';

describe('TrasnferenciaChatComponent', () => {
  let component: TransferenciaChatComponent;
  let fixture: ComponentFixture<TransferenciaChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciaChatComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
