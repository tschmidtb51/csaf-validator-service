import * as schemaTests from '../../../csaf-validator-lib/schemaTests.js'
import * as mandatoryTests from '../../../csaf-validator-lib/mandatoryTests.js'
import * as optionalTests from '../../../csaf-validator-lib/optionalTests.js'
import * as informativeTests from '../../../csaf-validator-lib/informativeTests.js'

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function (fastify) {
  fastify.get('/api/v1/tests', {}, async () => {
    const tests = Object.keys(schemaTests)
      .map((t) => ({ name: t, preset: 'schema' }))
      .concat(
        Object.keys(mandatoryTests).map((t) => ({
          name: t,
          preset: 'mandatory',
        }))
      )
      .concat(
        Object.keys(optionalTests).map((t) => ({
          name: t,
          preset: 'optional',
        }))
      )
      .concat(
        Object.keys(informativeTests).map((t) => ({
          name: t,
          preset: 'informative',
        }))
      )

    return tests
  })
}
