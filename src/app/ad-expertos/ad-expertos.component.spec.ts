import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdExpertosComponent } from './ad-expertos.component';

describe('AdExpertosComponent', () => {
  let component: AdExpertosComponent;
  let fixture: ComponentFixture<AdExpertosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdExpertosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdExpertosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
