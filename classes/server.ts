import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from  '../sockets/socket';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;

    // se deja privado para implementar patron Singleton, que exista una unica instancia del servidor en todo el proyecto
    private constructor() {
        this.app = express();
        this.port = SERVER_PORT

        // se usa un intermediario entre express y socketIO para configurarlo
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();
    }

    public static get instance() {
        // retorna si ya existe una instancia creada o crea una nueva
        return this._instance || (this._instance = new this());
    }

    private escucharSockets() {
        console.log('escuchando conexiones - sockets');

        // escucha cuando se conecta un cliente
        this.io.on('connection', cliente => {
            console.log('cliente conectado');

            // escucha el evento mensaje
            socket.mensaje(cliente, this.io);

            // escucha el evento desconectar
            socket.desconectar(cliente);
        });
    }

    start(callback: Function) {
        this.httpServer.listen(this.port, callback);
    }
}