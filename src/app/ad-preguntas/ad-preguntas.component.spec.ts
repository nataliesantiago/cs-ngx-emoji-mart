import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPreguntasComponent } from './ad-preguntas.component';

describe('AdPreguntasComponent', () => {
  let component: AdPreguntasComponent;
  let fixture: ComponentFixture<AdPreguntasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdPreguntasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
