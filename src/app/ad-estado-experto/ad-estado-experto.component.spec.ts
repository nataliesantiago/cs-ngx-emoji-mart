import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdEstadoExpertoComponent } from './ad-estado-experto.component';

describe('AdEstadoExpertoComponent', () => {
  let component: AdEstadoExpertoComponent;
  let fixture: ComponentFixture<AdEstadoExpertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdEstadoExpertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdEstadoExpertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
