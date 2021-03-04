import { CompilationResult } from "@remixproject/plugin-api"
import { useEffect, useState } from "react"
// eslint-disable-next-line import/no-webpack-loader-syntax
import createWorker from "workerize-loader!../workers/compiler.worker"
import { EVMVersion, Language, Source, SourceWithTarget } from "../types"
import { FileLoader } from "../utils"
import compilerInput from "../utils/compiler-input"
import * as CompilerWorker from "../workers/compiler.worker"

type CompilerVersion = {
  version: Version
  url: string
}

export enum Version {
  Five16 = "0.5.16",
  Six12 = "0.6.12",
  Seven7 = "0.7.6",
}

interface CompilerOptions {
  optimize: boolean
  runs: number
  evmVersion: EVMVersion
  language: Language
}

const COMPILER_VERSIONS: CompilerVersion[] = [
  {
    version: Version.Five16,
    url: "https://ethereum-optimism-compilers.surge.sh/solc-js-0-5-16.js",
  },
  {
    version: Version.Six12,
    url: "https://ethereum-optimism-compilers.surge.sh/solc-js-0-6-12.js",
  },
  {
    version: Version.Seven7,
    url: "https://ethereum-optimism-compilers.surge.sh/solc-js-0-7-6.js",
  },
]

const getCompilerUrl = (version: Version) =>
  COMPILER_VERSIONS.find((s) => s.version === version)

export const useCompiler = () => {
  const [workerInstances, setWorkerInstances] = useState(
    new Map<Version, any>()
  )
  const [compilerLoaded, setCompilerLoaded] = useState(false)

  const updateCompilerMap = (k: Version, v: any) => {
    setWorkerInstances(new Map(workerInstances.set(k, v)))
  }

  useEffect(() => {
    const loadCompilerVersions = async () => {
      console.log("Loading compilers")
      // set worker instances
      COMPILER_VERSIONS.forEach((version, index) => {
        const worker = createWorker<typeof CompilerWorker>()
        updateCompilerMap(version.version, worker)
      })
      const promises: any = []

      workerInstances.forEach((value, key) => {
        promises.push(value.loadCompiler(getCompilerUrl(key)?.url))
      })

      await Promise.all(promises)

      setCompilerLoaded(true)

      console.log("Compilers Loaded")
    }

    loadCompilerVersions()
  }, []) // eslint-disable-line

  const compileJSON = async (
    version: Version,
    source: SourceWithTarget,
    options: CompilerOptions
  ) => {
    const compilerInstance = workerInstances.get(version)
    if (!compilerInstance) {
      throw new Error("Invalid version")
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
        const data = await compilerInstance.compile(input)
        result = JSON.parse(data)
        return result
      }
    } catch (exception) {
      result = exception // { errors: [{ formattedMessage: 'Uncaught JavaScript exception:\n' + exception, severity: 'error', mode: 'panic' }] } // mode: 'panic' ?
    }
    return result
  }

  const compile = (
    version: Version,
    files: Source,
    options: CompilerOptions,
    fileLoader: FileLoader
  ): Promise<CompilationResult> => {
    return new Promise(async (resolve, reject) => {
      try {
        await fileLoader.gatherImports(files) // this should be pure...
        console.log("Files after", files)
        const input: SourceWithTarget = { sources: files }
        const result = compileJSON(version, input, options)
        console.log("result", result)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    compile,
    compilerVersions: COMPILER_VERSIONS,
    compilerLoaded,
  }
}
