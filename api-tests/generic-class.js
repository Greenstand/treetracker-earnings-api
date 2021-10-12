class GenericObject {
  constructor(payload) {
    this._object = payload;
  }

  delete_property(property) {
    delete this._object[property];
  }

  change_property(property, value) {
    this._object[property] = value;
  }
}

module.exports = {
  GenericObject,
};
