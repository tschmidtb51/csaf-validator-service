export function getValidSampleDocuments() {
  return [
    {
      document: {
        category: 'generic_csaf',
        csaf_version: '2.0',
        distribution: {
          tlp: {
            label: 'AMBER',
          },
        },
        lang: 'en',
        publisher: {
          category: 'other',
          name: 'Secvisogram Automated Tester',
          namespace: 'https://github.com/secvisogram/secvisogram',
        },
        references: [
          {
            category: 'self',
            summary: 'A non-canonical URL.',
            url: 'https://example.com/security/data/csaf/2021/my-thing-_10.json',
          },
        ],
        title: 'Minimal valid',
        tracking: {
          current_release_date: '2021-01-14T00:00:00.000Z',
          id: 'My-Thing-.10',
          initial_release_date: '2021-01-14T00:00:00.000Z',
          revision_history: [
            {
              date: '2021-01-14T00:00:00.000Z',
              number: '1',
              summary: 'Summary',
            },
          ],
          status: 'draft',
          version: '1',
        },
      },
    },
  ]
}
