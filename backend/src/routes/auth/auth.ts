// import { FastifyPluginAsync } from 'fastify'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Login } from '../../schemas/usuario.js';
import { SignOptions } from '@fastify/jwt';
import { usuarioRepository } from '../../services/usuario.repository.js';

const auth: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {

  fastify.get('/profile', {
    schema: {
      tags: ["auth"],
      summary: "Obtener perfil del usuario",
      description : "Ruta para obtener el perfil del usuario",
      security: [
        { bearerAuth: [] }
      ]
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      return request.user;  //
    }
  })

  fastify.post('/login', {
    schema: {
      tags: ["auth"],
      summary: "Ruta para obtener token",
      description : "Mediante usuario y contraseña se puede obtener un token para consumir la api.",
      body: Login
    },
    handler: async function (request, reply) {
      const { usuario, password } = request.body;
      
      const payload = await usuarioRepository.auth(usuario,password);
      
      const signOptions : SignOptions = {
        expiresIn : "8h", //Tiempo de validez del token
        notBefore : 0,    //Valido desde segundos...
      }
      const token = fastify.jwt.sign(payload,signOptions); //Generamos el token.
      return { token : token} //Si usuario y clave son correctos retorno el token para el usuario.
    }
  })

}

export default auth
