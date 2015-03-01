/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('Dictionary unit tests', function () {
  var dictionary;
  var key1 = {};
  var key2 = function () {
  };
  var key3 = {};
  it('Add item to Dictionary', function () {
    dictionary = new Dictionary();
    expect(function () {
      dictionary.add(NaN, "");
    }).toThrow();

    expect(dictionary.length).toBe(0);
    dictionary.add(key1, "1");
    expect(dictionary.length).toBe(1);
    dictionary.add(key2, "2");
    expect(dictionary.length).toBe(2);
    dictionary.add(key3, "3");
    expect(dictionary.length).toBe(3);
    expect(function () {
      dictionary.add(key2, "else");
    }).toThrow();
    expect(function () {
      dictionary.add(key3, 123);
    }).toThrow();

  });
  it('Get item from Dictionary', function () {
    expect(dictionary.get(key1)).toBe("1");
    expect(dictionary.get(key2)).toBe("2");
    expect(dictionary.get(key3)).toBe("3");
  });
  it('Has item in Dictionary', function () {
    expect(dictionary.has(key1)).toBe(true);
    expect(dictionary.has({})).toBe(false);
    expect(dictionary.has(key2)).toBe(true);
    expect(dictionary.has(function () {
    })).toBe(false);
    expect(dictionary.has("2")).toBe(false);
    expect(dictionary.has(key3)).toBe(true);
  });
  it('Remove item from Dictionary', function () {
    expect(dictionary.length).toBe(3);
    dictionary.remove(key1);
    expect(dictionary.length).toBe(2);
    dictionary.remove(key3);
    expect(dictionary.length).toBe(1);
    dictionary.remove(key2);
    expect(dictionary.length).toBe(0);
    dictionary.add({}, "190");
    dictionary.add(key1, "178");
    dictionary.add(key2, "156");
    dictionary.add(key3, "134");
    dictionary.add({}, "123");
    expect(dictionary.length).toBe(5);
    dictionary.clear();
    expect(dictionary.length).toBe(0);
  });
  it('Use of Dictionary#getFirstKey', function () {
    dictionary.clear();
    dictionary.add({}, false);
    dictionary.add({}, true);
    dictionary.add({}, 15);
    dictionary.add("178", key3);
    dictionary.add("156", key1);
    dictionary.add("134", key2);
    dictionary.add(key1, "178");
    dictionary.add(key2, "156");
    dictionary.add(key3, "134");
    var key4 = function () {
    };
    dictionary.add(key4, 7);
    var value = {};
    dictionary.add("2", value);
    expect(dictionary.getFirstKey(7)).toBe(key4);
    expect(dictionary.getFirstKey(value)).toBe("2");
    expect(dictionary.getFirstKey(key1)).toBe("156");
    expect(dictionary.getFirstKey("134")).toBe(key3);
  });
  it('Use of Dictionary#getAllKeys', function () {
    dictionary.clear();
    var list;
    dictionary.add({}, false);
    dictionary.add({}, true);
    dictionary.add({}, 15);
    dictionary.add(key1, "string1");
    dictionary.add(key2, "string1");
    dictionary.add(key3, "string1");
    dictionary.add(function () {
    }, 7);
    dictionary.add("2", {});
    list = dictionary.getAllKeys("string1");
    expect(list).toEqual([key1, key2, key3]);
    dictionary.clear();
    dictionary.add(true, {});
    dictionary.add(false, {});
    dictionary.add(15, {});
    dictionary.add("178", key2);
    dictionary.add("156", key2);
    dictionary.add("134", key2);
    dictionary.add(7, function () {
    });
    dictionary.add({}, "2");
    list = dictionary.getAllKeys(key2);
    expect(list).toEqual(["178", "156", "134"]);
  });
});