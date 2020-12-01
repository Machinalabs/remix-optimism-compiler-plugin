import { CondensedCompilationInput, SourcesInput } from "./input"
import { CompilationFileSources, CompilationResult } from "./output"
import { StatusEvents, Api } from "@remixproject/plugin-utils"

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
