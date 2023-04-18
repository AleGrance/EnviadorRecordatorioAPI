"use strict";

var CryptoJS = require("crypto-js");
module.exports = function (app) {
  var Users = app.db.models.Users;
  var htmlBody = "\n  <div style=\"text-align: center;\">\n  <h1>ERROR 403</h1>\n  <br>\n  <img src=\"http://i.stack.imgur.com/SBv4T.gif\" alt=\"I choose you!\"  width=\"250\" />\n  <br>\n  <h1>Forbidden</h1>\n  </div>\n  ";
  var apiToken = "35dd7b33-3c2a-48a4-827f-042e57c9c3b8";
  app.route('/api/users').get(function (req, res) {
    if (!req.headers.apitoken) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización"
      });
    }
    if (req.headers.apitoken === apiToken) {
      Users.findAll().then(function (result) {
        return res.json(result);
      })["catch"](function (error) {
        res.status(402).json({
          msg: error
        });
      });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida"
      });
    }
  }).post(function (req, res) {
    if (!req.headers.apitoken) {
      return res.status(403).send({
        error: "Forbidden",
        message: "Tu petición no tiene cabecera de autorización"
      });
    }
    if (req.headers.apitoken === apiToken) {
      // Receiving data
      var _req$body = req.body,
        user_name = _req$body.user_name,
        user_password = _req$body.user_password,
        user_email = _req$body.user_email,
        user_fullname = _req$body.user_fullname,
        role_id = _req$body.role_id;
      // Creating new user
      var user = {
        user_name: user_name,
        user_password: user_password,
        user_email: user_email,
        user_fullname: user_fullname,
        role_id: role_id
      };
      // Encrypting password
      user.user_password = CryptoJS.AES.encrypt(user.user_password, 'secret').toString();
      // Insert new user
      Users.create(user).then(function (result) {
        return res.json(result);
      })["catch"](function (error) {
        return res.json(error.message);
      });
    } else {
      return res.status(403).send({
        error: "Forbidden",
        message: "Cabecera de autorización inválida"
      });
    }
  });

  // app.route('/users/:user_id')
  //     .get((req, res) => {
  //         Users.findOne({
  //                 where: req.params
  //             })
  //             .then(result => res.json(result))
  //             .catch(error => {
  //                 res.status(404).json({
  //                     msg: error.message
  //                 });
  //             });
  //     })
  //     .put((req, res) => {
  //         Users.update(req.body, {
  //                 where: req.params
  //             })
  //             .then(result => res.sendStatus(204))
  //             .catch(error => {
  //                 res.status(412).json({
  //                     msg: error.message
  //                 });
  //             })
  //     })
  //     .delete((req, res) => {
  //         //const id = req.params.id;
  //         Users.destroy({
  //                 where: req.params
  //             })
  //             .then(() => res.json(req.params))
  //             .catch(error => {
  //                 res.status(412).json({
  //                     msg: error.message
  //                 });
  //             })
  //     })
};