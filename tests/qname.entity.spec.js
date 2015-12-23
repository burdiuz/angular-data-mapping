/**
 * Created by Oleg Galaburda on 28.02.2015.
 */
describe('QNameEntity unit tests', function () {
  it('create empty qname instance', function () {
    var entity = new QNameEntity();
    expect(entity.localName).toBe('');
    expect(entity.uri).toBe('');
  });
  it('check QNameEntity properties', function () {
    var entity = new QNameEntity('name', 'namespace');
    expect(entity.localName).toBe('name');
    expect(entity.uri).toBe('namespace');
  });
  it('check QNameEntity always cast properties into strings', function () {
    var entity = new QNameEntity(false, 123);
    expect(entity.localName).toBe('false');
    expect(entity.uri).toBe('123');
  });
});