import { CondensedCompilationInput } from "./input"
import { StatusEvents, Api } from "@remixproject/plugin-utils"
import { CompilationFileSources, CompilationResult, SourcesInput } from "@remixproject/plugin-api"

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
