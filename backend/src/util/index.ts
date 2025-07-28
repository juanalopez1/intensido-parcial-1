import createError from "@fastify/error";

// createError(code, message [, statusCode [, Base [, captureStackTrace]]])
export const    UCUError = createError("UCU_0001", "Error UCU: %s",500, Error); 
export const    UCUNoAutorizadoError = createError("UCU_0002", "No autorizado",401, Error); 
export const    UCUNoEncontradoError = createError("UCU_0003", "No se encontró el elemento %s",404, Error); 
export const    UCUConflictoError = createError("UCU_0004", "%s",409, Error); 