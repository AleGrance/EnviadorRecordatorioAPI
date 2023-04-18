"use strict";

module.exports = function (app) {
  var Tasks = app.db.models.Tasks;
  var Users = app.db.models.Users;
  app.route('/api/tasks').get(function (req, res) {
    Tasks.findAll({
      order: [['createdAt', 'DESC']]
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(402).json({
        msg: error.menssage
      });
    });
  }).post(function (req, res) {
    console.log(req.body);
    Tasks.create(req.body).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      return res.json(error.errors);
    });
  });
  app.route('/tasks/:task_id').get(function (req, res) {
    Tasks.findOne({
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
    Tasks.update(req.body, {
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
    Tasks.destroy({
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