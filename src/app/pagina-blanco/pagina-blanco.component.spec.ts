import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaBlancoComponent } from './pagina-blanco.component';

describe('PaginaBlancoComponent', () => {
  let component: PaginaBlancoComponent;
  let fixture: ComponentFixture<PaginaBlancoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaBlancoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaBlancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
