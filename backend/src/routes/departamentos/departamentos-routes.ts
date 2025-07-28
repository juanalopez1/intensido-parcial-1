import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { departamentoRepository } from "../../services/departamentos.repository.js";
import { Departamento } from "../../schemas/departamento.js";
import { Type } from "@sinclair/typebox";
import { Localidad } from "../../schemas/localidad.js";

const departamentoRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", {
    schema: {
      response: {
        200: Type.Array(Departamento),
      },
      tags: ["departamentos"],
      summary: "Obtener listado de departamentos",
      description: "Obtener listado de departamentos",
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      return departamentoRepository.getAll();
    },
  });

  fastify.get("/:id_departamento", {
    schema: {
      tags: ["departamentos"],
      summary: "Obtener listado de departamentos",
      description: "Obtener listado de departamentos",
      params: Type.Object({ id_departamento: Type.Integer() }),
      response: {
        200: Departamento,
      },
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticateAdmin],
    handler: async function (request, reply) {
      const { id_departamento } = request.params as { id_departamento: number };
      const queryResult = await departamentoRepository.getById(id_departamento);
      reply.status(200).send(queryResult);
    },
  });

  fastify.get("/:id_departamento/localidades", {
    schema: {
      params: Type.Object({ id_departamento: Type.Integer() }),
      response: { 200: Type.Array(Localidad) },
      tags: ["departamentos"],
      summary: "Obtener listado de localidades de un departamento",
      description:
        "Obtener listado de localidades de un departamento por su ID.",
      security: [{ bearerAuth: [] }],
    },
    handler: async function (request, reply) {
      const { id_departamento } = request.params as { id_departamento: number };
      const queryResult = await departamentoRepository.getLocalidades(id_departamento);
      return reply.status(200).send(queryResult);
    },
  });
};

export default departamentoRoutes;
