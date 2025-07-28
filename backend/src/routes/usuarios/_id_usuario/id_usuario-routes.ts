import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { Usuario } from "../../../schemas/usuario.js";
import { usuarioRepository } from "../../../services/usuario.repository.js";
import { Departamento } from "../../../schemas/departamento.js";
import { Localidad, LocalidadUsuario } from "../../../schemas/localidad.js";

const usuariosRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      params: Type.Object({ id_usuario: Type.Number() }),
      response: {
        200: Type.Object({ usuario: Usuario }),
      },
      summary: "Obtener información de usuario.",
      description: "Devuelve la información personal de un usuario por su ID.",
      security: [{ bearerAuth: [] }],
      tags: ["usuarios"],
    },
    onRequest: [fastify.authenticateAdmin], //TODO
    handler: async function (request, reply) {
      const { id_usuario } = request.params as { id_usuario: number };
      const queryResult = await usuarioRepository.getById(id_usuario);
      return reply.status(200).send({ usuario: queryResult });
    },
  });

  fastify.get("/departamentos", {
    schema: {
      params: Type.Object({ id_usuario: Type.Number() }),
      response: {
        200: Type.Array(Departamento),
      },
      tags: ["usuarios"],
      summary: "Obtener deptos usuario",
      description: "Obtener departamentos del usuario",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      const { id_usuario } = request.params as { id_usuario: number };
      const queryResult = await usuarioRepository.getDepartamentos(id_usuario);
      return reply.status(200).send(queryResult);
    },
  });

  fastify.get("/departamentos/:id_departamento/localidades", {
    schema: {
      params: Type.Object({
        id_usuario: Type.Number(),
        id_departamento: Type.Number(),
      }),
      response: {
        200: Type.Array(Localidad),
      },
      tags: ["usuarios"],
      summary: "Localidades usuario.",
      description:
        "Obtener las localidades de un determinado departamento del usuario",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin], // TODO
    handler: async function (request, reply) {
      const { id_usuario, id_departamento } = request.params as {
        id_usuario: number;
        id_departamento: number;
      };
      const queryResult = await usuarioRepository.getLocalidades(
        id_usuario,
        id_departamento
      );
      return reply.status(200).send(queryResult);
    },
  });

  fastify.post("/departamentos/:id_departamento/localidades", {
    schema: {
      params: Type.Object({
        id_usuario: Type.Number(),
        id_departamento: Type.Number(),
      }),
      body: Type.Omit(LocalidadUsuario, ["departamento", "usuario"]),
      response: {
        201: Type.Object({ localidad: LocalidadUsuario }),
      },
      tags: ["usuarios"],
      summary: "Crear Localidad",
      description: "Agregar una localidad como supervisada por el usuario.",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      const queryResult = usuarioRepository.addLocalidad(request.body);
      if (!queryResult) {
        throw new Error("Algo salio mal.");
      }
      reply.status(201).send({ localidad: request.body });
    },
  });

  fastify.delete("/departamentos/:id_departamento/localidades/:id_localidad", {
    schema: {
      params: Type.Object({
        id_usuario: Type.Number(),
        id_departamento: Type.Number(),
        id_localidad: Type.Number(),
      }),
      response: {
        204: Type.Object({ mensaje: Type.String() }),
      },
      tags: ["usuarios"],
      summary: "Borrar localidad",
      description: "Borrar localidad.",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      const { id_usuario, id_departamento, id_localidad } = request.params as {
        id_usuario: number;
        id_departamento: number;
        id_localidad: number;
      };

      usuarioRepository.removeLocalidad(
        id_usuario,
        id_departamento,
        id_localidad
      );
      return reply.status(204).send({ mensaje: "Localidad eliminada." });
    },
  });
};

export default usuariosRoutes;
