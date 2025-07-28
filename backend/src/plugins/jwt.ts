import fp from 'fastify-plugin'
import jwt, { FastifyJWTOptions } from '@fastify/jwt'
import { UCUError, UCUNoAutorizadoError } from '../util/index.js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Usuario } from '../schemas/usuario.js';



const jwtOptions: FastifyJWTOptions = {
  secret: process.env.FASTIFY_SECRET || ''  //El or es porque no puede ser undefined
};

const jwtPlugin = fp<FastifyJWTOptions>(async (fastify) => {
  //Recordar que string '' es falsy.
  if (!jwtOptions.secret) throw new UCUError("Falta setear el secret.");
  fastify.register(jwt,jwtOptions)
  
  fastify.decorate('authenticate', async function (req:FastifyRequest , rep:FastifyReply) {
    const url = req.routeOptions.url; //  /auth/login
    if (url != "/auth/login")   //Si no es la ruta de logueo...
      await req.jwtVerify();    //Verifico el token y eso.
  })

  fastify.decorate(
    "authenticateSelf",
    async function (
      request: FastifyRequest & {
        params: { id_usuario: Usuario["id_usuario"] };
      },
      _reply: FastifyReply
    ) {
      const payload = (await request.jwtVerify()) as {
        id_usuario: number;
      };

      if (request.params.id_usuario != payload.id_usuario) {
        throw new UCUNoAutorizadoError("No eres tú.");
      }
    }
  );

  fastify.decorate(
    "authenticateAdmin",
    async function (request: FastifyRequest, _reply: FastifyReply) {
      const payload = (await request.jwtVerify()) as {
        id_usuario: number;
        roles: string[];
      };

      if (!payload.roles.includes('admin')) {
        throw new UCUNoAutorizadoError(
          "No eres administrador, no tienes dichos privilegios."
        );
      }
    }
  );
});

export default jwtPlugin;

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: Usuario;
    user: Usuario;
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(req:FastifyRequest , rep:FastifyReply): Promise<void>;
    authenticateSelf(req:FastifyRequest , rep:FastifyReply): Promise<void>;
    authenticateAdmin(req:FastifyRequest , rep:FastifyReply): Promise<void>;
  }
}
