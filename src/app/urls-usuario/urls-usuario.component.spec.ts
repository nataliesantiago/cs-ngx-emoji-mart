import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlsUsuarioComponent } from './urls-usuario.component';

describe('UrlsUsuarioComponent', () => {
  let component: UrlsUsuarioComponent;
  let fixture: ComponentFixture<UrlsUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlsUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlsUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
