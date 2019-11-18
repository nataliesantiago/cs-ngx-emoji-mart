import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCuraduriaComponent } from './historial-curaduria.component';

describe('HistorialCuraduriaComponent', () => {
  let component: HistorialCuraduriaComponent;
  let fixture: ComponentFixture<HistorialCuraduriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialCuraduriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCuraduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
