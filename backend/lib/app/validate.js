import * as schemaTests from '../../../csaf-validator-lib/schemaTests.js'
import * as mandatoryTests from '../../../csaf-validator-lib/mandatoryTests.js'
import * as optionalTests from '../../../csaf-validator-lib/optionalTests.js'
import * as informativeTests from '../../../csaf-validator-lib/informativeTests.js'
import validate from '../../../csaf-validator-lib/validate.js'

/** @typedef {Parameters<typeof validate>[0][number]} DocumentTest */

/** @type {Record<string, Parameters<typeof validate>[0][number] | undefined>} */
const tests = Object.fromEntries(
  /** @type {Array<[string, any]>} */ (Object.entries(schemaTests))
    .concat(Object.entries(mandatoryTests))
    .concat(Object.entries(optionalTests))
    .concat(Object.entries(informativeTests))
)

/** @type {Record<string, Parameters<typeof validate>[0] | undefined>} */
const presets = {
  schema: Object.values(schemaTests),
  mandatory: Object.values(mandatoryTests),
  optional: Object.values(optionalTests),
  informative: Object.values(informativeTests),
}

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function (fastify) {
  /** @type {import('ajv').JSONSchemaType<import('./validate/types.js').RequestBody>} */
  const requestBodySchema = {
    type: 'object',
    required: ['document', 'tests'],
    properties: {
      tests: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['preset', 'test'] },
          },
        },
      },
      document: {
        type: 'object',
        additionalProperties: true,
        properties: {},
      },
    },
  }

  fastify.post(
    '/api/v1/validate',
    { schema: { body: requestBodySchema } },
    async (request) => {
      const requestBody =
        /** @type {import('./validate/types.js').RequestBody} */ (request.body)

      const results = await validate(
        requestBody.tests
          .flatMap((t) =>
            t.type === 'preset'
              ? presets[t.name] ?? []
              : [tests[t.name]].filter(
                  /** @returns {t is DocumentTest} */
                  (t) => Boolean(t)
                )
          )
          .filter(
            (test, i, array) =>
              array.findIndex((a) => a.name === test.name) === i
          ),
        requestBody.document
      )

      return results
    }
  )
}
