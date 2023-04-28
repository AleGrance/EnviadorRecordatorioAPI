let hoyAhora = new Date();
let fullHoraAhora = hoyAhora.toString().slice(16, 21);

module.exports = app => {

    //metodo sync que crea las tablas
    app.db.sequelize.sync()
    .then(() => {
        app.listen(app.get('port'), () => {
            console.log('Server on port', app.get('port'));
            console.log("Enviador de recordatorios 24hs y 48hs iniciado a las:", fullHoraAhora);
        });
    });

};