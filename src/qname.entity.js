/**
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
  this.localName = name===undefined ? '' : String(name);
  /**
   * @property
   * @name QNameEntity#uri
   * @type {string}
   */
  this.uri = uri===undefined ? '' : String(uri);
}