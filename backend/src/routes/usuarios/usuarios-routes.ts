import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { usuarioRepository } from "../../services/usuario.repository.js";
import { Usuario } from "../../schemas/usuario.js";

const usuariosRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      response: {
        200: Type.Array(Usuario),
      },
      tags: ["usuarios"],
      summary: "Obtener listado de usuarios",
      description: "Obtener listado de usuarios",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      return usuarioRepository.getAll();
    },
  });

  fastify.post("/", {
    schema: {
      body: Type.Omit(Usuario, ["id_usuario"]),
      response: {
        201: Type.Object({ usuario: Usuario }),
      },
      tags: ["usuarios"],
      summary: "Crear usuario",
      description: "Crear usuario",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      const queryResult = await usuarioRepository.create(request.body);
      if (!queryResult) {
        throw new Error("Error al crear usuario.");
      }
      return reply.status(201).send({ usuario: queryResult });
    },
  });
};

export default usuariosRoutes;
