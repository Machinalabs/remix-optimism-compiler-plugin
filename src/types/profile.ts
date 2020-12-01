import { OptimismCompilerApi } from "./optimism-compiler"
import { LibraryProfile } from "@remixproject/plugin-utils"

export const compilerProfile: LibraryProfile<OptimismCompilerApi> = {
  name: "optimism-compiler",
  methods: ["compile", "getCompilationResult"],
  events: ["compilationFinished"],
}
