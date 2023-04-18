"use strict";

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _cryptoJs = _interopRequireDefault(require("crypto-js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
module.exports = function (app) {
  var Users = app.db.models.Users;
  app.route('/api/auth').get(function (req, res) {
    res.send("Api Auth");
  });
  app.route('/auth').post(function (req, res) {
    Users.findOne({
      where: {
        user_name: req.body.user_name
      }
    }).then(function (result) {
      // If user doesn't exists show message
      if (!result) return res.status(404).send({
        message: "El usuario no esta registrado!"
      });
      // If users exists
      // Decrypt
      var bytes = _cryptoJs["default"].AES.decrypt(result.user_password, 'secret');
      var passDecrypted = bytes.toString(_cryptoJs["default"].enc.Utf8);
      // If passwords do not match show message
      if (req.body.user_password !== passDecrypted) return res.status(401).send({
        message: "El password es incorrecto",
        auth: false,
        token: null
      });
      // Gen token
      var token = _jsonwebtoken["default"].sign({
        id: result.user_id
      }, 'secret', {
        expiresIn: 60 * 60 * 24
      });
      res.status(200).send({
        message: "Acceso correcto",
        auth: true,
        token: token,
        usuario: result.user_fullname
      });
    })["catch"](function (error) {
      res.send(error);
    });
  });
};