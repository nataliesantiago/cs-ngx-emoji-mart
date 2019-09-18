import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdExpertizComponent } from './ad-expertiz.component';

describe('AdExpertizComponent', () => {
  let component: AdExpertizComponent;
  let fixture: ComponentFixture<AdExpertizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdExpertizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdExpertizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
