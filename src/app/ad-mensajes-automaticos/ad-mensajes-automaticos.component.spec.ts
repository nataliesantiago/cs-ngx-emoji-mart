import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdMensajesAutomaticosComponent } from './ad-mensajes-automaticos.component';

describe('AdMensajesAutomaticosComponent', () => {
  let component: AdMensajesAutomaticosComponent;
  let fixture: ComponentFixture<AdMensajesAutomaticosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdMensajesAutomaticosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdMensajesAutomaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
