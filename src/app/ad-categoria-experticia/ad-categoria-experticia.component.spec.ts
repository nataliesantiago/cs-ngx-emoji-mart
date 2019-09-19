import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCategoriaExperticiaComponent } from './ad-categoria-experticia.component';

describe('AdCategoriaExperticiaComponent', () => {
  let component: AdCategoriaExperticiaComponent;
  let fixture: ComponentFixture<AdCategoriaExperticiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdCategoriaExperticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdCategoriaExperticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
