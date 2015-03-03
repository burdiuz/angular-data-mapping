/**
 * @exports QNameEntity
 */
/**
 * @class QNameEntity
 * @param {string} [name]
 * @param {string} [uri]
 */
function QNameEntity(name, uri) {
  /**
   * @type {string}
   */
  this.localName = name === undefined ? '' : String(name);
  /**
   * @type {string}
   */
  this.uri = uri === undefined ? '' : String(uri);
}