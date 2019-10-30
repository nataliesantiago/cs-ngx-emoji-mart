import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoSearchComponent } from './resultado-search.component';

describe('ResultadoSearchComponent', () => {
  let component: ResultadoSearchComponent;
  let fixture: ComponentFixture<ResultadoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
