import { usuariosConectados } from './../sockets/socket';
import { Router, Request, Response } from 'express';
import Server from '../classes/server';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien'
    });

});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    // emite el mensaje escuchado a todos los que estan suscritos
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        mensaje: 'POST listo',
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    // envia mensaje privado en una sala en particular, que seria el mismo id del usuario
    server.io.in(id).emit('mensaje-privado', payload)

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;

    server.io.clients((err: any, clientes: string[]) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });            
        }

        // si todo esta bien, lo retorna
        res.json({
            ok: true,
            clientes
        });
    });
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    // si todo esta bien, lo retorna
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });
    
});

export default router;