import fs, { existsSync } from 'fs'
import path from 'path'
import { UploadedFile } from 'adminjs'
import { ERROR_MESSAGES } from '../constants'

import { BaseProvider } from './base-provider'

/**
 * Options required by the LocalAdapter
 *
 * @memberof module:@adminjs/upload
 */
export type LocalUploadOptions = {
  /**
   * Path where files will be stored. For example: `path.join(__dirname, '../public')`
   */
  bucket: string;
}

export class LocalProvider extends BaseProvider {
  constructor(options: LocalUploadOptions) {
    super(options.bucket)
    if (!existsSync(options.bucket)) {
      throw new Error(ERROR_MESSAGES.NO_DIRECTORY(options.bucket))
    }
  }

  public async upload(file: UploadedFile, key: string): Promise<any> {
    const filePath = this.path(key)
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
    await fs.promises.copyFile(file.path, filePath)
    await fs.promises.unlink(file.path)
  }

  public async delete(key: string, bucket: string): Promise<any> {
    await fs.promises.unlink(this.path(key, bucket))
  }

  // eslint-disable-next-line class-methods-use-this
  public path(key: string, bucket?: string): string {
    return `/${path.join(bucket || this.bucket, key)}`
  }
}
