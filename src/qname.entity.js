/**
 * Created by Oleg Galaburda on 25.02.2015.
 * @exports QNameEntity
 */
/**
 * @namespace QNameEntity
 * @param {string} [name]
 * @param {string} [namespace]
 * @constructor
 */
function QNameEntity(name, uri) {
  /**
   * @property
   * @name QNameEntity#localName
   * @type {string}
   */
  this.localName = name ? String(name) : '';
  /**
   * @property
   * @name QNameEntity#uri
   * @type {string}
   */
  this.uri = uri ? String(uri) : '';
}
addType('QName', QNameEntity);