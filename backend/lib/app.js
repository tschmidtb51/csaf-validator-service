/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function (fastify) {
  fastify.register(import('./app/getTests.js'))
  fastify.register(import('./app/validate.js'))
}
