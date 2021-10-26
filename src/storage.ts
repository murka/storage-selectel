import fetch, { Headers } from 'node-fetch'
import type {
  ContainerFiles,
  FileUploadRequestOptions,
  MakeRequestOptions,
  SelectelOptions,
  getContainerFilesOptions
} from './types'
import querystring = require('querystring')

export default class SelectelStorage {
  private user: string
  private password: string
  private container: string
  private X_AUTH_TOKEN: string
  private X_EXPIRE_AUTH_TOKEN: Date
  private X_STORAGE_URL: string
  private AUTH_EXPIRE_TOKEN: number
  private disableSSL: boolean

  constructor({ user, password, container, AUTH_EXPIRE_TOKEN, disableSSL }: SelectelOptions) {
    if (!user || !password) {
      throw new Error('Selectel user and password must be provided')
    }
    this.user = user
    this.password = password
    this.container = container || undefined
    this.X_AUTH_TOKEN = null 
    this.X_EXPIRE_AUTH_TOKEN = new Date(0)
    this.X_STORAGE_URL = null
    this.AUTH_EXPIRE_TOKEN = AUTH_EXPIRE_TOKEN || 24 * 60 * 60 * 1000 // 1 day
    this.disableSSL = disableSSL || false
  }

  private checkAuthorize = () => this.X_EXPIRE_AUTH_TOKEN.getTime() - (new Date()).getTime() > this.AUTH_EXPIRE_TOKEN ? Promise.resolve(true) : this.authorize()

  private makeRequest = async (options: MakeRequestOptions, container: string = this.container) => {
    if(!container) {
      throw new Error('Container must be provided')
    }
    const authz = await this.checkAuthorize()
    const url = `${this.X_STORAGE_URL}${container}/${options.path ?? ''}?${querystring.stringify(options.querystring)}`
    if(authz && this.X_AUTH_TOKEN) {
      try {
        return await fetch(url, {
          method: options.method,
          headers: new Headers({
            'X-Auth-Token': this.X_AUTH_TOKEN
          }),
          body: options.body,
        })
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  private get apiURL() {
    return `http${this.disableSSL ? '' : 's'}://auth.selcdn.ru/`
  }

  private async authorize() {
    try {
      const response = await fetch(this.apiURL, {
        headers: {
          'X-Auth-User': this.user,
          'X-Auth-Key': this.password,
        }
      })
      this.X_AUTH_TOKEN = response.headers.get('x-auth-token')
      this.X_STORAGE_URL = response.headers.get('x-storage-url')
      this.X_EXPIRE_AUTH_TOKEN = new Date((new Date).getTime() + Number(response.headers.get('x-expire-auth-token')) * 1000)
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  async getContainerFiles({ container, path }: getContainerFilesOptions = { container: this.container, path: '' }): Promise<ContainerFiles[]> {
    const response = (await this.makeRequest({
      method: 'GET',
      querystring: { format: 'json', path }
    }, container))?.json() as unknown as ContainerFiles[] ?? []
    return response
  }

  async uploadFile({ container, ...options }: FileUploadRequestOptions) {
    await this.makeRequest({
      method: 'PUT',
      ...options
    }, container)
  }
}
