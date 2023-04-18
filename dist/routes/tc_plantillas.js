"use strict";

module.exports = function (app) {
  var Tc_plantillas = app.db.models.Tc_plantillas;
  var Users = app.db.models.Users;
  app.route("/api/tcPlantillas").get(function (req, res) {
    Tc_plantillas.findAll({
      order: [["createdAt", "DESC"]]
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(402).json({
        msg: error.menssage
      });
    });
  }).post(function (req, res) {
    console.log(req.body);
    Tc_plantillas.create(req.body).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      return res.json(error.errors);
    });
  });
  app.route("/api/tcPlantillas/:task_id").get(function (req, res) {
    Tc_plantillas.findOne({
      where: req.params,
      include: [{
        model: Users
      }]
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(404).json({
        msg: error.message
      });
    });
  }).put(function (req, res) {
    Tc_plantillas.update(req.body, {
      where: req.params
    }).then(function (result) {
      return res.sendStatus(204);
    })["catch"](function (error) {
      res.status(412).json({
        msg: error.message
      });
    });
  })["delete"](function (req, res) {
    //const id = req.params.id;
    Tc_plantillas.destroy({
      where: req.params
    }).then(function () {
      return res.json(req.params);
    })["catch"](function (error) {
      res.status(412).json({
        msg: error.message
      });
    });
  });
};