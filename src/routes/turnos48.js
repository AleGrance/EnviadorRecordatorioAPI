const { Op } = require("sequelize");
const axios = require("axios");
const cron = require('node-cron');
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
const templateThikchat = "883acf57-9c9c-465c-81b4-2f16feaf4371";

// Tiempo de retraso de consulta al PGSQL para iniciar el envio. 1 minuto
var tiempoRetrasoPGSQL = 1000 * 60;
// Tiempo entre envios. Cada 4 segundos envía un mensaje a la API de Thinkcomm
var tiempoRetrasoEnvios = 4000;

module.exports = (app) => {
  const Turnos48 = app.db.models.Turnos48;
  const Users = app.db.models.Users;

  // Ejecutar la funcion de 48hs de Lunes(1) a Jueves (4) a las 07:00am
  cron.schedule('00 8 * * 1-4', () => {
    let hoyAhora = new Date();
    let diaHoy = hoyAhora.toString().slice(0, 3);
    let fullHoraAhora = hoyAhora.toString().slice(16, 21);
    
    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log('CRON: Se consulta al JKMT 48hs');
    injeccionFirebird48();
  });

  // Ejecutar la funcion de 72hs los Viernes(5) y Sabados(6)
  cron.schedule('00 8 * * 5,6', () => {
    let hoyAhora = new Date();
    let diaHoy = hoyAhora.toString().slice(0, 3);
    let fullHoraAhora = hoyAhora.toString().slice(16, 21);
    
    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log('CRON: Se consulta al JKMT 72hs');
    injeccionFirebird72();
  });

  // Consulta al JKMT
  function injeccionFirebird48() {
    console.log("Se actualiza el PSQL 48hs");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
        // Trae los ultimos 50 registros de turnos del JKMT
        "SELECT * FROM VW_RESUMEN_TURNOS_48HS",
        
        function (err, result) {
          console.log("Cant de turnos obtenidos del JKMT:", result.length);

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

            Turnos48.create(e)
              //.then((result) => res.json(result))
              .catch((error) => console.log(error.message));
          });

          // IMPORTANTE: cerrar la conexion
          db.detach();
          console.log(
            "Llama a la funcion iniciar envio que se retrasa 1 min en ejecutarse 48hs"
          );
          iniciarEnvio();
        }
      );
    });
  }

  // Consulta al JKMT
  function injeccionFirebird72() {
    console.log("Se actualiza el PSQL 72hs");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
        // Trae los ultimos 50 registros de turnos del JKMT
        "SELECT * FROM VW_RESUMEN_TURNOS_72HS",
        
        function (err, result) {
          console.log("Cant de turnos 72hs obtenidos del JKMT:", result.length);

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

            Turnos48.create(e)
              //.then((result) => res.json(result))
              .catch((error) => console.log(error.message));
          });

          // IMPORTANTE: cerrar la conexion
          db.detach();
          console.log(
            "Llama a la funcion iniciar envio que se retrasa 1 min en ejecutarse 48hs"
          );
          iniciarEnvio();
        }
      );
    });
  }

  injeccionFirebird72();

  let losTurnos = [];

  function iniciarEnvio() {
    setTimeout(() => {
      Turnos48.findAll({
        where: { estado_envio: 0 },
        order: [["createdAt", "DESC"]],
      })
        .then((result) => {
          losTurnos = result;
          console.log("Enviando turnos 48hs:", losTurnos.length);
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
    console.log("Inicia el recorrido del for para enviar los turnos 48hs");
    for (let i = 0; i < losTurnos.length; i++) {
      const turnoId = losTurnos[i].id_turno;
      const data = {
        action: "send_template",
        token:
          "tk162c5b6f2cfaf4982acddd9ee1a978c39c349acfaf9d24c750dcaf9caf7392c7",
        from: "595214129000",
        to: losTurnos[i].TELEFONO_MOVIL,
        template_id: templateThikchat,
        template_params: [
          losTurnos[i].CLIENTE,
          losTurnos[i].FECHA + " " + losTurnos[i].HORA,
          losTurnos[i].SUCURSAL,
          losTurnos[i].NOMBRE_COMERCIAL,
          losTurnos[i].CARNET,
        ],
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

            Turnos48.update(body, {
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

            Turnos48.update(body, {
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
    .route("/api/turnos48")
    .get((req, res) => {
      Turnos48.findAll({
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
      Turnos48.create(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
    });

  // Trae los turnos que tengan en el campo estado_envio = 0
  app.route("/api/turnos48Pendientes").get((req, res) => {
    Turnos48.findAll({
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
  app.route("/api/turnos48Notificados").get((req, res) => {
    // Fecha de hoy 2022-02-30
    let fechaHoy = new Date().toISOString().slice(0, 10);

    Turnos48.count({
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
  app.route("/api/turnos48NotificadosFecha").post((req, res) => {
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

    Turnos48.count({
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
    .route("/api/turnos48/:id_turno")
    .get((req, res) => {
      Turnos48.findOne({
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
      Turnos48.update(req.body, {
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
      Turnos48.destroy({
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
