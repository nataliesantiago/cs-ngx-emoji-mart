import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntencionesChatComponent } from './intenciones-chat.component';

describe('IntencionesChatComponent', () => {
  let component: IntencionesChatComponent;
  let fixture: ComponentFixture<IntencionesChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntencionesChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntencionesChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
