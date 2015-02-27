/**
 * Created by Oleg Galaburda on 26.02.2015.
 * @exports Dictionary
 */
/**
 * @namespace Dictionary
 * @constructor
 */
function Dictionary() {
  /**
   * @type {Array}
   */
  var keys;
  /**
   * @type {Array}
   */
  var values;
  /**
   * @function Dictionary#add
   * @param {*} key
   * @param {*} value
   */
  this.add = function (key, value) {
    keys.push(key);
    values.push(value);
  };
  /**
   * @function Dictionary#get
   * @param {*} key
   * @returns {*}
   */
  this.get = function (key) {
    var index = keys.indexOf(key);
    return index >= 0 ? values[index] : null;
  };
  /**
   * @function Dictionary#getFirstKey
   * @param {*} value
   * @returns {*}
   */
  this.getFirstKey = function (value) {
    var index = values.indexOf(value);
    return index >= 0 ? keys[index] : null;
  };
  /**
   * @function Dictionary#getAllKeys
   * @param {*} value
   * @returns {Array}
   */
  this.getAllKeys = function (value) {
    var list = [],
      index = -1;
    while((index = values.indexOf(value, index))>=0){
      list.push(values[index]);
      index++;
    }
    return list;
  };
  /**
   * @function Dictionary#has
   * @param {*} key
   * @returns {boolean}
   */
  this.has = function (key) {
    return keys.indexOf(key) >= 0;
  };
  /**
   * @function Dictionary#remove
   * @param {*} key
   */
  this.remove = function (key) {
    var index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      values.splice(index, 1);
    }
  };
  /**
   * @function Dictionary#clear
   */
  this.clear = function () {
    keys = [];
    values = [];
  };
  this.clear();
}