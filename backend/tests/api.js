import { expect } from 'chai'
import { Agent, request, setGlobalDispatcher } from 'undici'
import * as schemaTests from '../../csaf-validator-lib/schemaTests.js'
import * as mandatoryTests from '../../csaf-validator-lib/mandatoryTests.js'
import * as optionalTests from '../../csaf-validator-lib/optionalTests.js'
import * as informativeTests from '../../csaf-validator-lib/informativeTests.js'
import { getConfig } from './shared/configData.js'
import { getValidSampleDocuments } from './shared/sampleDocumentsData.js'

const agent = new Agent({
  keepAliveTimeout: 10,
  keepAliveMaxTimeout: 10,
})

setGlobalDispatcher(agent)

describe('API', function () {
  describe('GET /api/v1/tests', function () {
    it('returns a list of all available tests alongside their preset', async function () {
      const res = await request(
        'http://localhost:' + getConfig().port + '/api/v1/tests'
      )
      const body = await res.body.json()

      expect(res.statusCode).to.equal(200)
      expect(body).to.deep.equal(
        Object.keys(schemaTests)
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
      )
    })
  })

  describe('POST /api/v1/validate', function () {
    describe('documents can be checked using presets and single tests', function () {
      for (let i = 0; i < getValidSampleDocuments().length; ++i) {
        const doc = getValidSampleDocuments()[i]

        it(`valid document #${i + 1}`, async function () {
          const requestBody = JSON.stringify({
            tests: [
              { type: 'test', name: 'mandatoryTest_6_1_1' },
              { type: 'preset', name: 'optional' },
            ],
            document: doc,
          })
          const res = await request(
            'http://localhost:' + getConfig().port + '/api/v1/validate',
            {
              method: 'POST',
              body: requestBody,
              headers: {
                'content-length': Buffer.byteLength(requestBody).toString(),
                'content-type': 'application/json',
              },
            }
          )
          const body = await res.body.json()

          expect(res.statusCode).to.equal(200)
          expect(body).to.deep.equal({
            tests: [
              {
                name: 'mandatoryTest_6_1_1',
                errors: [],
                warnings: [],
                infos: [],
                isValid: true,
              },
              ...Object.keys(optionalTests).map((name) => ({
                name,
                errors: [],
                warnings: [],
                infos: [],
                isValid: true,
              })),
            ],
            isValid: true,
          })
        })
      }
    })

    describe('tests are only executed once', function () {
      for (let i = 0; i < getValidSampleDocuments().length; ++i) {
        const doc = getValidSampleDocuments()[i]

        it(`valid document #${i + 1}`, async function () {
          const requestBody = JSON.stringify({
            tests: [
              { type: 'test', name: 'mandatoryTest_6_1_1' },
              { type: 'test', name: 'mandatoryTest_6_1_1' },
            ],
            document: doc,
          })
          const res = await request(
            'http://localhost:' + getConfig().port + '/api/v1/validate',
            {
              method: 'POST',
              body: requestBody,
              headers: {
                'content-length': Buffer.byteLength(requestBody).toString(),
                'content-type': 'application/json',
              },
            }
          )
          const body = await res.body.json()

          expect(res.statusCode).to.equal(200)
          expect(body).to.deep.equal({
            tests: [
              {
                name: 'mandatoryTest_6_1_1',
                errors: [],
                warnings: [],
                infos: [],
                isValid: true,
              },
            ],
            isValid: true,
          })
        })
      }
    })
  })
})
