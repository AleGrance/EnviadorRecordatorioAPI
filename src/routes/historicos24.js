const cron = require("node-cron");
const { Op } = require("sequelize");

module.exports = (app) => {
  const Historicos24 = app.db.models.Historicos24;
  const Turnos24 = app.db.models.Turnos24;

  let historicoObj = {
    fecha: "",
    cant_enviados: 0,
    cant_no_enviados: 0,
    user_id: 1,
  };

  // DESHABILITADO!!!
  // Ejecutar la funcion a las 10:00 de Lunes(1) a Sabados (6)
  // cron.schedule("50 08 * * 1-5", () => {
  //   let hoyAhora = new Date();
  //   let diaHoy = hoyAhora.toString().slice(0, 3);
  //   let fullHoraAhora = hoyAhora.toString().slice(16, 21);

  //   console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
  //   console.log("CRON: Se almacena el historico de los enviados hoy - 24hs");
  //   cantidadTicketsEnviados();
  // });

  async function cantidadTicketsEnviados() {
    // Fecha de hoy 2022-02-30
    let fechaHoy = new Date().toISOString().slice(0, 10);
    historicoObj.fecha = fechaHoy;

    historicoObj.cant_enviados = await Turnos24.count({
      where: {
        [Op.and]: [
          { estado_envio: 1 },
          {
            updatedAt: {
              [Op.between]: [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"],
            },
          },
        ],
      },
    });

    historicoObj.cant_no_enviados = await Turnos24.count({
      where: {
        [Op.and]: [
          { estado_envio: 2 },
          {
            updatedAt: {
              [Op.between]: [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"],
            },
          },
        ],
      },
    });

    console.log(historicoObj);

    Historicos24.create(historicoObj)
      .then((result) => {
        console.log("Se inserto la cantidad de envios de hoy en historico!");
      })
      //.catch((error) => console.log(error.detail));
      .catch((error) => console.log(error.message));
  }

  /**
   *
   *  METODOS
   *
   */

  app
    .route("/historicos24")
    .get((req, res) => {
      Historicos24.findAll()
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    })
    .post((req, res) => {
      Historicos24.create(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
    });

  // Historicos por rango de fecha
  app.route("/historicos24Fecha").post((req, res) => {
    let fechaHoy = new Date().toISOString().slice(0, 10);
    let { fecha_desde, fecha_hasta } = req.body;

    if (fecha_desde === "" && fecha_hasta === "") {
      fecha_desde = fechaHoy;
      fecha_hasta = fechaHoy;
    }

    if (fecha_hasta == "") {
      fecha_hasta = fecha_desde;
    }

    if (fecha_desde == "") {
      fecha_desde = fecha_hasta;
    }

    console.log(req.body);

    Historicos24.findAll({
      where: {
        fecha: {
          [Op.between]: [fecha_desde + " 00:00:00", fecha_hasta + " 23:59:59"],
        },
      },
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // app
  //   .route("/roles/:role_id")
  //   .get((req, res) => {
  //     Roles.findOne({
  //       where: req.params,
  //     })
  //       .then((result) => res.json(result))
  //       .catch((error) => {
  //         res.status(404).json({
  //           msg: error.message,
  //         });
  //       });
  //   })
  //   .put((req, res) => {
  //     Roles.update(req.body, {
  //       where: req.params,
  //     })
  //       .then((result) => res.sendStatus(204))
  //       .catch((error) => {
  //         res.status(412).json({
  //           msg: error.message,
  //         });
  //       });
  //   })
  //   .delete((req, res) => {
  //     //const id = req.params.id;
  //     Roles.destroy({
  //       where: req.params,
  //     })
  //       .then(() => res.json(req.params))
  //       .catch((error) => {
  //         res.status(412).json({
  //           msg: error.message,
  //         });
  //       });
  //   });
};
