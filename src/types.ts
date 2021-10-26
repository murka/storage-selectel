import type { BodyInit, HeadersInit } from 'node-fetch'
import type { ParsedUrlQueryInput } from 'querystring'

export interface SelectelOptions {
  /**
   * User
  */
  user: string
  /**
   * Password
   */
  password: string
  /**
   * Container name
   */
  container: string
  /**
   * Auth expire token time in milliseconds
   * @default 24 * 60 * 60 * 1000 // 1 day
   */
  AUTH_EXPIRE_TOKEN?: number
  /**
   * For disable SSL certificate check
   * @default false
   */
  disableSSL?: boolean
}

export interface MakeRequestOptions {
  path?: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PURGE',
  headers?: HeadersInit,
  body?: BodyInit
  querystring? : ParsedUrlQueryInput
}

export interface FileUploadRequestOptions {
  path: string,
  container?: string,
  body: BodyInit
  headers?: HeadersInit,
  querystring? : ParsedUrlQueryInput
}

export type getContainerFilesOptions = {
  container?: string,
  path?: string,
}

export type ContainerFiles = {
  bytes: number,
  hash: string,
  name: string,
  content_type: string,
  last_modified: string  
}

