import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEncuestasComponent } from './ad-encuestas.component';

describe('AdEncuestasComponent', () => {
  let component: AdEncuestasComponent;
  let fixture: ComponentFixture<AdEncuestasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdEncuestasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
