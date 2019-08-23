import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoCuraduriaComponent } from './flujo-curaduria.component';

describe('FlujoCuraduriaComponent', () => {
  let component: FlujoCuraduriaComponent;
  let fixture: ComponentFixture<FlujoCuraduriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlujoCuraduriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujoCuraduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
