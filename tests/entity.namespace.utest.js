/**
 * Created by Oleg Galaburda on 01.03.2015.
 */

describe('EntityNamespace unit tests', function () {
  var ns;

  function Definition1() {
  }

  function Definition2() {
  }

  function Definition3() {
  }

  it('Create new namespace', function () {
    ns = new EntityNamespace();
    expect(ns.name).toBe('');
    ns = new EntityNamespace('namespace name');
    expect(ns.name).toBe('namespace name');
  });
  it('Add definition to namespace', function () {
    ns.add('def1', Definition1);
    ns.add('def2', Definition2);
    ns.add('def3', Definition3);
    expect(function () {
      ns.add('def1', Definition3);
    }).toThrow();
    expect(function () {
      ns.add('defN', {});
    }).toThrow();
    expect(function () {
      ns.add('defA', null);
    }).toThrow();
  });
  it('Get definition by name', function () {
    expect(ns.get('def1')).toBe(Definition1);
    expect(ns.get('def2')).toBe(Definition2);
    expect(ns.get('def3')).toBe(Definition3);
    expect(function () {
      ns.get('defN');
    }).toThrow();
  });
});