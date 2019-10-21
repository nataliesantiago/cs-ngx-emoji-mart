import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolaSupervisorComponent } from './consola-supervisor.component';

describe('ConsolaSupervisorComponent', () => {
  let component: ConsolaSupervisorComponent;
  let fixture: ComponentFixture<ConsolaSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolaSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolaSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
