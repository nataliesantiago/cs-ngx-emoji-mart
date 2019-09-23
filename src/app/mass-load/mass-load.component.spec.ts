import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassLoadComponent } from './mass-load.component';

describe('MassLoadComponent', () => {
  let component: MassLoadComponent;
  let fixture: ComponentFixture<MassLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
