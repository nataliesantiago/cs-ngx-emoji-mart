import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProComponent } from './home-pro.component';

describe('HomeProComponent', () => {
  let component: HomeProComponent;
  let fixture: ComponentFixture<HomeProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
