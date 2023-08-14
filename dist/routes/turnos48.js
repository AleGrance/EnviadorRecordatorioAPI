"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = require("sequelize"),
  Op = _require.Op;
var axios = require("axios");
var cron = require("node-cron");
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
var url = "https://odontos.whatsapp.net.py/thinkcomm-x/integrations/odontos/";
var templateThikchat = "883acf57-9c9c-465c-81b4-2f16feaf4371";

// Tiempo de retraso de consulta al PGSQL para iniciar el envio. 1 minuto
var tiempoRetrasoPGSQL = 1000 * 60;
// Tiempo entre envios. Cada 4 segundos envía un mensaje a la API de Thinkcomm
var tiempoRetrasoEnvios = 4000;
module.exports = function (app) {
  var Turnos48 = app.db.models.Turnos48;
  var Users = app.db.models.Users;
  var blacklist = ["2023-05-02", "2023-05-16", "2023-08-15"];

  // Ejecutar la funcion de 48hs de Lunes(1) a Jueves (4) a las 08:00am
  cron.schedule("00 08 * * 1-4", function () {
    var hoyAhora = new Date();
    var diaHoy = hoyAhora.toString().slice(0, 3);
    var fullHoraAhora = hoyAhora.toString().slice(16, 21);

    // Checkear la blacklist antes de ejecutar la función
    var now = new Date();
    var dateString = now.toISOString().split("T")[0];
    if (blacklist.includes(dateString)) {
      console.log("La fecha ".concat(dateString, " est\xE1 en la blacklist y no se ejecutar\xE1 la tarea."));
      return;
    }
    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log("CRON: Se consulta al JKMT 48hs");
    injeccionFirebird48();
  });

  // Ejecutar la funcion de 72hs los Viernes(5) y Sabados(6)
  cron.schedule("00 08 * * 5,6", function () {
    var hoyAhora = new Date();
    var diaHoy = hoyAhora.toString().slice(0, 3);
    var fullHoraAhora = hoyAhora.toString().slice(16, 21);
    console.log("Hoy es:", diaHoy, "la hora es:", fullHoraAhora);
    console.log("CRON: Se consulta al JKMT 72hs");
    injeccionFirebird72();
  });

  // Consulta al JKMT 48
  function injeccionFirebird48() {
    console.log("Se actualiza el PSQL 48hs");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
      // Trae los ultimos 50 registros de turnos del JKMT
      //"SELECT * FROM VW_RESUMEN_TURNOS_48HS",
      // Se excluye a las sucursales
      "SELECT * FROM VW_RESUMEN_TURNOS_48HS_EXC", function (err, result) {
        console.log("Cant de turnos obtenidos del JKMT:", result.length);

        // Recorre el array que contiene los datos e inserta en la base de postgresql
        result.forEach(function (e) {
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
          ["catch"](function (error) {
            return console.log(error.message);
          });
        });

        // IMPORTANTE: cerrar la conexion
        db.detach();
        console.log("Llama a la funcion iniciar envio que se retrasa 1 min en ejecutarse 48hs");
        iniciarEnvio();
      });
    });
  }

  // Consulta al JKMT 72
  function injeccionFirebird72() {
    console.log("Se actualiza el PSQL 72hs");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
      // Trae los ultimos 50 registros de turnos del JKMT
      "SELECT * FROM VW_RESUMEN_TURNOS_72HS_EXC", function (err, result) {
        console.log("Cant de turnos 72hs obtenidos del JKMT:", result.length);

        // Recorre el array que contiene los datos e inserta en la base de postgresql
        result.forEach(function (e) {
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
          ["catch"](function (error) {
            return console.log(error.message);
          });
        });

        // IMPORTANTE: cerrar la conexion
        db.detach();
        console.log("Llama a la funcion iniciar envio que se retrasa 1 min en ejecutarse 48hs");
        iniciarEnvio();
      });
    });
  }

  //injeccionFirebird72();

  var losTurnos = [];
  function iniciarEnvio() {
    setTimeout(function () {
      Turnos48.findAll({
        where: {
          estado_envio: 0
        },
        order: [["createdAt", "DESC"]]
      }).then(function (result) {
        losTurnos = result;
        console.log("Enviando turnos 48hs:", losTurnos.length);
      }).then(function () {
        enviarMensaje();
      })["catch"](function (error) {
        res.status(402).json({
          msg: error.menssage
        });
      });
    }, tiempoRetrasoPGSQL);
  }

  // Envia los mensajes
  var retraso = function retraso() {
    return new Promise(function (r) {
      return setTimeout(r, tiempoRetrasoEnvios);
    });
  };
  function enviarMensaje() {
    return _enviarMensaje.apply(this, arguments);
  }
  /*
  
  Metodos
  
  */
  function _enviarMensaje() {
    _enviarMensaje = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _loop, i;
      return _regeneratorRuntime().wrap(function _callee$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Inicia el recorrido del for para enviar los turnos 48hs");
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var turnoId, data;
              return _regeneratorRuntime().wrap(function _loop$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    turnoId = losTurnos[i].id_turno;
                    data = {
                      action: "send_template",
                      token: "tk162c5b6f2cfaf4982acddd9ee1a978c39c349acfaf9d24c750dcaf9caf7392c7",
                      from: "595214129000",
                      to: losTurnos[i].TELEFONO_MOVIL,
                      template_id: templateThikchat,
                      template_params: [losTurnos[i].CLIENTE, losTurnos[i].FECHA + " " + losTurnos[i].HORA, losTurnos[i].SUCURSAL, losTurnos[i].NOMBRE_COMERCIAL, losTurnos[i].CARNET]
                    }; // Funcion ajax para nodejs que realiza los envios a la API de TC
                    axios.post(url, data).then(function (response) {
                      console.log(response.data);
                      if (response.data.success == true) {
                        //console.log("Enviado");
                        // Se actualiza el estado a 1
                        var body = {
                          estado_envio: 1
                        };
                        Turnos48.update(body, {
                          where: {
                            id_turno: turnoId
                          }
                        })
                        //.then((result) => res.json(result))
                        ["catch"](function (error) {
                          res.status(412).json({
                            msg: error.message
                          });
                        });
                      } else {
                        //console.log("No Enviado");
                        // Se actualiza el estado a 2
                        var _body = {
                          estado_envio: 2
                        };
                        Turnos48.update(_body, {
                          where: {
                            id_turno: turnoId
                          }
                        })
                        //.then((result) => res.json(result))
                        ["catch"](function (error) {
                          res.status(412).json({
                            msg: error.message
                          });
                        });
                      }
                    })["catch"](function (error) {
                      console.error("Ocurrió un error:", error);
                    });
                    _context.next = 5;
                    return retraso();
                  case 5:
                  case "end":
                    return _context.stop();
                }
              }, _loop);
            });
            i = 0;
          case 3:
            if (!(i < losTurnos.length)) {
              _context2.next = 8;
              break;
            }
            return _context2.delegateYield(_loop(), "t0", 5);
          case 5:
            i++;
            _context2.next = 3;
            break;
          case 8:
          case "end":
            return _context2.stop();
        }
      }, _callee);
    }));
    return _enviarMensaje.apply(this, arguments);
  }
  app.route("/api/turnos48").get(function (req, res) {
    Turnos48.findAll({
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
    Turnos48.create(req.body).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      return res.json(error);
    });
  });

  // Trae los turnos que tengan en el campo estado_envio = 0
  app.route("/api/turnos48Pendientes").get(function (req, res) {
    Turnos48.findAll({
      where: {
        estado_envio: 0
      },
      order: [["FECHA_CREACION", "ASC"]]
      //limit: 5
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(402).json({
        msg: error.menssage
      });
    });
  });

  // Trae los turnos que ya fueron notificados hoy
  app.route("/api/turnos48Notificados").get(function (req, res) {
    // Fecha de hoy 2022-02-30
    var fechaHoy = new Date().toISOString().slice(0, 10);
    Turnos48.count({
      where: _defineProperty({}, Op.and, [{
        estado_envio: 1
      }, {
        updatedAt: _defineProperty({}, Op.between, [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"])
      }])
      //order: [["FECHA_CREACION", "DESC"]],
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(402).json({
        msg: error.menssage
      });
    });
  });

  // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  app.route("/api/turnos48NotificadosFecha").post(function (req, res) {
    var fechaHoy = new Date().toISOString().slice(0, 10);
    var _req$body = req.body,
      fecha_desde = _req$body.fecha_desde,
      fecha_hasta = _req$body.fecha_hasta;
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
      where: _defineProperty({}, Op.and, [{
        estado_envio: 1
      }, {
        updatedAt: _defineProperty({}, Op.between, [fecha_desde + " 00:00:00", fecha_hasta + " 23:59:59"])
      }])
      //order: [["createdAt", "DESC"]],
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(402).json({
        msg: error.menssage
      });
    });
  });

  // Metodos GET PUT y DELETE
  app.route("/api/turnos48/:id_turno").get(function (req, res) {
    Turnos48.findOne({
      where: req.params,
      include: [{
        model: Users,
        attributes: ["user_fullname"]
      }]
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(404).json({
        msg: error.message
      });
    });
  }).put(function (req, res) {
    Turnos48.update(req.body, {
      where: req.params
    }).then(function (result) {
      return res.json(result);
    })["catch"](function (error) {
      res.status(412).json({
        msg: error.message
      });
    });
  })["delete"](function (req, res) {
    //const id = req.params.id;
    Turnos48.destroy({
      where: req.params
    }).then(function () {
      return res.json(req.params);
    })["catch"](function (error) {
      res.status(412).json({
        msg: error.message
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