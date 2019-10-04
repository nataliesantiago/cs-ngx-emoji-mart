import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioMotivoCierreChatComponent } from './formulario-motivo-cierre-chat.component';

describe('FormularioMotivoCierreChatComponent', () => {
  let component: FormularioMotivoCierreChatComponent;
  let fixture: ComponentFixture<FormularioMotivoCierreChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioMotivoCierreChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioMotivoCierreChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
