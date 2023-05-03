"use strict";

var hoyAhora = new Date();
var fullHoraAhora = hoyAhora.toString().slice(16, 21);
module.exports = function (app) {
  //metodo sync que crea las tablas
  app.db.sequelize.sync().then(function () {
    app.listen(app.get('port'), function () {
      console.log('Server on port', app.get('port'));
      console.log("Enviador de recordatorios 24hs y 48hs iniciado a las:", fullHoraAhora);
    });
  });
};