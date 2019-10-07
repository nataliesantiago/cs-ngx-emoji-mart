import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SosOperadorComponent } from './sos-operador.component';

describe('SosOperadorComponent', () => {
  let component: SosOperadorComponent;
  let fixture: ComponentFixture<SosOperadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosOperadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SosOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
