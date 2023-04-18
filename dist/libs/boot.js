"use strict";

var _https = _interopRequireDefault(require("https"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
module.exports = function (app) {
  //metodo sync que crea las tablas
  app.db.sequelize.sync().then(function () {
    app.listen(app.get('port'), function () {
      console.log('Server on port', app.get('port'));
    });
    /*https.createServer({
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    }, app).listen(app.get('port'), () => {
        console.log('Server on port', app.get('port'));
    });*/
  });
};