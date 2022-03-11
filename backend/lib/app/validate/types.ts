export interface RequestBody {
  tests: Array<{
    type: 'preset' | 'test'
    name: string
  }>
  document: {}
}
