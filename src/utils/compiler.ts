import * as wrapper from "@eth-optimism/solc/wrapper"
import { CompilationResult } from "@remixproject/plugin-api"

import { EVMVersion, Language, Source, SourceWithTarget } from "../types"
import { RemixClientInstanceType } from "../hooks"

import compilerInput from "./compiler-input"

interface CompilerOptions {
  optimize: boolean
  runs: number
  evmVersion: EVMVersion
  language: Language
}

export class Compiler {
  clientInstance
  compiler: any

  constructor(clientInstance: RemixClientInstanceType) {
    this.clientInstance = clientInstance
  }

  async loadVersion(compilerUrl: string) {
    return new Promise((resolve, reject) => {
      delete (window as any)["Module"] // TODO Improve typing
      // NOTE: workaround some browsers?
      ;(window as any)["Module"] = undefined
      const newScript: HTMLScriptElement = document.createElement("script")
      newScript.type = "text/javascript"
      newScript.src = compilerUrl
      document.getElementsByTagName("head")[0].appendChild(newScript)

      const check: number = window.setInterval(() => {
        if (!(window as any)["Module"]) {
          return
        }
        window.clearInterval(check)
        const compiler: any = wrapper((window as any)["Module"])
        this.compiler = compiler
        resolve(true)
      }, 200)
    })
  }

  private compileJSON(source: SourceWithTarget, options: CompilerOptions) {
    const missingInputs: string[] = []
    const missingInputsCallback = (path: string) => {
      missingInputs.push(path)
      return { error: "Deferred import" }
    }
    let result: CompilationResult = {} as CompilationResult
    try {
      if (source && source.sources) {
        const { optimize, runs, evmVersion, language } = options
        const input = compilerInput(source.sources, {
          optimize,
          runs,
          evmVersion,
          language,
        })
        result = JSON.parse(
          this.compiler.compile(input, { import: missingInputsCallback })
        )
      }
    } catch (exception) {
      result = exception //{ errors: [{ formattedMessage: 'Uncaught JavaScript exception:\n' + exception, severity: 'error', mode: 'panic' }] } // mode: 'panic' ?
    }
    return result //{
    // result,
    // missingInputs,
    // source
    // }
  }

  compile(files: Source, options: CompilerOptions): Promise<CompilationResult> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Files before", files)
        await this.gatherImports(files) // this should be pure...
        console.log("Files after", files)
        const input: SourceWithTarget = { sources: files }
        const result = this.compileJSON(input, options)
        console.log("result", result)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  private async gatherImports(files: Source, importHints?: string[]) {
    importHints = importHints || []
    // FIXME: This will only match imports if the file begins with one '.'
    // It should tokenize by lines and check each.
    // const result = {}
    const importRegex = /^\s*import\s*['"]([^'"]+)['"];/g
    for (const fileName in files) {
      let match: RegExpExecArray | null
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
      // To descomentar
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
