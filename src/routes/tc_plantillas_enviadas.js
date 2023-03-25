module.exports = (app) => {
  const Tc_plantillas_enviadas = app.db.models.Tc_plantillas_enviadas;
  const Users = app.db.models.Users;

  app
    .route("/api/tcPlantillasEnviadas")
    .get((req, res) => {
      Tc_plantillas_enviadas.findAll({
        order: [["createdAt", "DESC"]],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    })
    .post((req, res) => {
      console.log(req.body);
      Tc_plantillas_enviadas.create(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.json(error.errors));
    });

  app
    .route("/api/tcPlantillasEnviadas/:task_id")
    .get((req, res) => {
      Tc_plantillas_enviadas.findOne({
        where: req.params,
        include: [
          {
            model: Users,
          },
        ],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(404).json({
            msg: error.message,
          });
        });
    })
    .put((req, res) => {
      Tc_plantillas_enviadas.update(req.body, {
        where: req.params,
      })
        .then((result) => res.sendStatus(204))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    })
    .delete((req, res) => {
      //const id = req.params.id;
      Tc_plantillas_enviadas.destroy({
        where: req.params,
      })
        .then(() => res.json(req.params))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    });
};
