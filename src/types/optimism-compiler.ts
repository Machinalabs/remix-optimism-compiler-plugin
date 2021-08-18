import { CondensedCompilationInput } from "./input"
import { StatusEvents, PluginApi, Api } from "@remixproject/plugin-utils"
import {
  CompilationFileSources,
  CompilationResult,
  SourcesInput,
} from "@remixproject/plugin-api"
import { PluginClient } from "@remixproject/plugin"
import { IRemixApi } from "@remixproject/plugin-api"
import { EVMVersion, Language } from "./compiler"

export interface OptimismCompilerApi extends Api {
  events: {
    compilationFinished: (
      fileName: string,
      source: CompilationFileSources,
      languageVersion: string,
      data: CompilationResult
    ) => void
  } & StatusEvents
  methods: {
    getCompilationResult(): CompilationResult
    compile(fileName: string): void
    setCompilerConfig(settings: CondensedCompilationInput): void
    compileWithParameters(
      targets: SourcesInput,
      settings: CondensedCompilationInput
    ): CompilationResult
  }
}

export type RemixClientInstanceType = PluginApi<Readonly<IRemixApi>> &
  PluginClient<Api, Readonly<IRemixApi>>

export type CompilerVersion = {
  version: Version
  url: string
}

export enum Version {
  Five16 = "0.5.16",
  Six12 = "0.6.12",
  Seven7 = "0.7.6",
  Eight4 = "0.8.4",
}

export interface CompilerOptions {
  optimize: boolean
  runs: number
  evmVersion: EVMVersion
  language: Language
}
