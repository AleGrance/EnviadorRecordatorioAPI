const { Op } = require("sequelize");
const axios = require("axios");
const cron = require("node-cron");
var Firebird = require("node-firebird");

// Var para la conexion a la base de JKMT
var odontos = {};
odontos.host = "192.168.10.247";
odontos.port = 3050;
odontos.database = "c:\\\\jakemate\\\\base\\\\ODONTOS64.fdb";
odontos.user = "SYSDBA";
odontos.password = "masterkey";
odontos.lowercase_keys = false; // set to true to lowercase keys
odontos.role = null; // default
odontos.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
odontos.blobAsText = false;

// Var para la conexion a WWA de ThinkComm
//const url = "http://localhost:3001/lead";
const url = "https://odontos.whatsapp.net.py/thinkcomm-x/integrations/odontos/";
const templateThikchat = "c2a1bc33-6a72-4fbf-bf0e-954759f8e547";

// Tiempo de retraso de consulta al PGSQL para iniciar el envio. 1 minuto
var tiempoRetrasoPGSQL = 1000 * 60;
// Tiempo entre envios. Cada 4 segundos envía un mensaje a la API de Thinkcomm
var tiempoRetrasoEnvios = 4000;

module.exports = (app) => {
  const Turnos24 = app.db.models.Turnos24;
  const Users = app.db.models.Users;

  // Ejecutar la funcion de 24hs De Lunes(1) a Viernes(5) a las 08:00am

  /********************
   * CRON CON BLACKLIST
   ********************/

  // Array para almacenar las fechas prohibidas
  const blacklist = ["2023-05-02", "2023-05-16", "2023-06-13"];

  // DESHABILITADO!!!
  // cron.schedule(
  //   "00 08 * * 2-5",
  //   () => {
  //     let hoyAhora = new Date();
  //     let diaHoy = hoyAhora.toString().slice(0, 3); //Fri
  //     let fullHoraAhora = hoyAhora.toString().slice(16, 21); //12:20

  //     const now = new Date();
  //     const dateString = now.toISOString().split("T")[0];
  //     if (blacklist.includes(dateString)) {
  //       console.log(`La fecha ${dateString} está en la blacklist y no se ejecutará la tarea.`);
  //       return;
  //     }

  //     console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
  //     console.log("CRON: Se consulta al JKMT 24hs");
  //     //injeccionFirebird24();
  //   });

  // Consulta al JKMT
  function injeccionFirebird24() {
    console.log("Se actualiza el PSQL 24hs");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
        // Trae los ultimos 50 registros de turnos del JKMT
        "SELECT * FROM VW_RESUMEN_TURNOS_24HS",

        function (err, result) {
          console.log("Cant de turnos 24hs obtenidos del JKMT:", result.length);

          // Recorre el array que contiene los datos e inserta en la base de postgresql
          result.forEach((e) => {
            // Si el nro de cert trae NULL cambiar por 000000
            if (!e.CARNET) {
              e.CARNET = " ";
            }
            // Si no tiene plan
            if (!e.PLAN_CLIENTE) {
              e.PLAN_CLIENTE = " ";
            }
            // Si la hora viene por ej: 11:0 entonces agregar el 0 al final
            // if (e.HORA[3] === "0") {
            //   e.HORA = e.HORA + "0";
            // }
            // Si la hora viene por ej: 10:3 o 11:2 entonces agregar el 0 al final
            // if (e.HORA.length === 4 && e.HORA[0] === "1") {
            //   e.HORA = e.HORA + "0";
            // }

            // Si el nro de tel trae NULL cambiar por 595000 y cambiar el estado a 2
            // Si no reemplazar el 0 por el 595
            if (!e.TELEFONO_MOVIL) {
              e.TELEFONO_MOVIL = "595000";
              e.estado_envio = 2;
            } else {
              e.TELEFONO_MOVIL = e.TELEFONO_MOVIL.replace(0, "595");
            }

            // Reemplazar por mi nro para probar el envio
            // if (!e.TELEFONO_MOVIL) {
            //   e.TELEFONO_MOVIL = "595000";
            //   e.estado_envio = 2;
            // } else {
            //   e.TELEFONO_MOVIL = "595986153301";
            // }

            Turnos24.create(e)
              //.then((result) => res.json(result))
              .catch((error) => console.log(error.message));
          });

          // IMPORTANTE: cerrar la conexion
          db.detach();
          console.log(
            "Llama a la funcion iniciar envio que se retrasa 1 min en ejecutarse 24hs"
          );
          iniciarEnvio();
        }
      );
    });
  }

  let losTurnos = [];

  function iniciarEnvio() {
    setTimeout(() => {
      Turnos24.findAll({
        where: { estado_envio: 0 },
        order: [["createdAt", "DESC"]],
      })
        .then((result) => {
          losTurnos = result;
          console.log("Enviando turnos 24hs:", losTurnos.length);
        })
        .then(() => {
          enviarMensaje();
        })
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    }, tiempoRetrasoPGSQL);
  }

  // Envia los mensajes
  let retraso = () => new Promise((r) => setTimeout(r, tiempoRetrasoEnvios));
  async function enviarMensaje() {
    console.log("Inicia el recorrido del for para enviar los turnos 24hs");
    for (let i = 0; i < losTurnos.length; i++) {
      const turnoId = losTurnos[i].id_turno;
      const data = {
        action: "send_template",
        token:
          "tk162c5b6f2cfaf4982acddd9ee1a978c39c349acfaf9d24c750dcaf9caf7392c7",
        from: "595214129000",
        to: losTurnos[i].TELEFONO_MOVIL,
        template_id: templateThikchat,
        template_params: [],
      };

      // Funcion ajax para nodejs que realiza los envios a la API de TC
      axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
          if (response.data.success == true) {
            //console.log("Enviado");
            // Se actualiza el estado a 1
            const body = {
              estado_envio: 1,
            };

            Turnos24.update(body, {
              where: { id_turno: turnoId },
            })
              //.then((result) => res.json(result))
              .catch((error) => {
                res.status(412).json({
                  msg: error.message,
                });
              });
          } else {
            //console.log("No Enviado");
            // Se actualiza el estado a 2
            const body = {
              estado_envio: 2,
            };

            Turnos24.update(body, {
              where: { id_turno: turnoId },
            })
              //.then((result) => res.json(result))
              .catch((error) => {
                res.status(412).json({
                  msg: error.message,
                });
              });
          }
        })
        .catch((error) => {
          console.error("Ocurrió un error:", error);
        });

      await retraso();
    }
  }

  /*
  
  Metodos
  
  */

  app
    .route("/api/turnos24")
    .get((req, res) => {
      Turnos24.findAll({
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
      Turnos24.create(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
    });

  // Trae los turnos que tengan en el campo estado_envio = 0
  app.route("/api/turnos24Pendientes").get((req, res) => {
    Turnos24.findAll({
      where: { estado_envio: 0 },
      order: [["FECHA_CREACION", "ASC"]],
      //limit: 5
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Trae los turnos que ya fueron notificados hoy
  app.route("/api/turnos24Notificados").get((req, res) => {
    // Fecha de hoy 2022-02-30
    let fechaHoy = new Date().toISOString().slice(0, 10);

    Turnos24.count({
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
      //order: [["FECHA_CREACION", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  app.route("/api/turnos24NotificadosFecha").post((req, res) => {
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

    Turnos24.count({
      where: {
        [Op.and]: [
          { estado_envio: 1 },
          {
            updatedAt: {
              [Op.between]: [
                fecha_desde + " 00:00:00",
                fecha_hasta + " 23:59:59",
              ],
            },
          },
        ],
      },
      //order: [["createdAt", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Metodos GET PUT y DELETE
  app
    .route("/api/turnos24/:id_turno")
    .get((req, res) => {
      Turnos24.findOne({
        where: req.params,
        include: [
          {
            model: Users,
            attributes: ["user_fullname"],
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
      Turnos24.update(req.body, {
        where: req.params,
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    })
    .delete((req, res) => {
      //const id = req.params.id;
      Turnos24.destroy({
        where: req.params,
      })
        .then(() => res.json(req.params))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    });
  // // Turnos no enviados - estado_envio 2 o 3
  // app.route("/turnosNoNotificados").get((req, res) => {
  //   // Fecha de hoy 2022-02-30
  //   let fechaHoy = new Date().toISOString().slice(0, 10);
  //   Turnos.count({
  //     where: {
  //       [Op.and]: [
  //         { estado_envio: { [Op.in]: [2, 3] } },
  //         {
  //           updatedAt: {
  //             [Op.between]: [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"],
  //           },
  //         },
  //       ],
  //     },
  //     //order: [["FECHA_CREACION", "DESC"]],
  //   })
  //     .then((result) => res.json(result))
  //     .catch((error) => {
  //       res.status(402).json({
  //         msg: error.menssage,
  //       });
  //     });
  // });

  // // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  // app.route("/turnosNoNotificadosFecha").post((req, res) => {
  //   let fechaHoy = new Date().toISOString().slice(0, 10);
  //   let { fecha_desde, fecha_hasta } = req.body;

  //   if (fecha_desde === "" && fecha_hasta === "") {
  //     fecha_desde = fechaHoy;
  //     fecha_hasta = fechaHoy;
  //   }

  //   if (fecha_hasta == "") {
  //     fecha_hasta = fecha_desde;
  //   }

  //   if (fecha_desde == "") {
  //     fecha_desde = fecha_hasta;
  //   }

  //   console.log(req.body);

  //   Turnos.count({
  //     where: {
  //       [Op.and]: [
  //         { estado_envio: { [Op.in]: [2, 3] } },
  //         {
  //           updatedAt: {
  //             [Op.between]: [
  //               fecha_desde + " 00:00:00",
  //               fecha_hasta + " 23:59:59",
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //     //order: [["createdAt", "DESC"]],
  //   })
  //     .then((result) => res.json(result))
  //     .catch((error) => {
  //       res.status(402).json({
  //         msg: error.menssage,
  //       });
  //     });
  // });
};
