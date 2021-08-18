import { RemixClientInstanceType, Source } from "../types"

export class FileLoader {
  clientInstance
  compiler: any

  constructor(clientInstance: RemixClientInstanceType) {
    this.clientInstance = clientInstance
  }

  public async gatherImports(files: Source, importHints?: string[]) {
    importHints = importHints || []
    // FIXME: This will only match imports if the file begins with one '.'
    // It should tokenize by lines and check each.
    // const result = {}
    const importRegex = /^\s*import\s*['"]([^'"]+)['"];/g
    for (const fileName in files) {
      if (!fileName) {
        continue
      }
      let match: RegExpExecArray | null
      // tslint:disable-next-line
      while ((match = importRegex.exec(files[fileName].content))) {
        let importFilePath = match[1]
        if (importFilePath.startsWith("./")) {
          const path: RegExpExecArray | null = /(.*\/).*/.exec(fileName)
          importFilePath = path
            ? importFilePath.replace("./", path[1])
            : importFilePath.slice(2)
        }
        if (!importHints.includes(importFilePath))
          importHints.push(importFilePath)
      }
    }
    while (importHints.length > 0) {
      const m: string = importHints.pop() as string
      if (m && m in files) continue
      try {
        const content = await this.importFileCb(m)
        files[m] = { content }
        await this.gatherImports(files, importHints)
      } catch (error) {
        throw error
      }
      return
    }
  }

  private async importFileCb(url: string) {
    const content = await this.clientInstance.call(
      "contentImport",
      "resolveAndSave" as any,
      url
    )
    return content
  }
}
