import Server from "./classes/server";
import router from './routes/router';
import bodyPaser from 'body-parser';
import cors from 'cors';

const server = Server.instance;

// configuracion del body-parser
server.app.use(bodyPaser.urlencoded({ extended: true }));
server.app.use(bodyPaser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true }));

// usa las rutas
server.app.use('/', router);

server.start(() => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});