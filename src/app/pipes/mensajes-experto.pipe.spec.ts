import { MensajesExpertoPipe } from '../../pipes/mensajes-experto.pipe';

describe('MensajesExpertoPipe', () => {
  it('create an instance', () => {
    const pipe = new MensajesExpertoPipe();
    expect(pipe).toBeTruthy();
  });
});
