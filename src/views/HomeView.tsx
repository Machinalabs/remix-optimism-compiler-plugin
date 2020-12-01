import React, { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons"
import { CompilationError, CompilationResult } from "@remixproject/plugin-api"

import {
  getCleanedFileName,
  hasSolidityExtension,
  log,
  Compiler,
} from "../utils"
import { useRemix } from "../hooks"

import { ResultsSection, StyledSection } from "./components"

type CompilerVersion = {
  version: string
  url: string
}

const COMPILER_VERSIONS: CompilerVersion[] = [
  {
    version: "0.5.16",
    url: "https://solc-js-0-5-16.surge.sh/soljson.js",
  },
  {
    version: "0.5.17",
    url: "https://solc-js-0-5-16.surge.sh/soljson.js",
  },
]

const DEFAULT_RUNS = 200

enum EVMVersion { // TODO Remove duplicated
  default = "default",
  istanbul = "istanbul",
  petersburg = "petersburg",
  constantinople = "constantinople",
  byzantium = "byzantium",
  spuriousDragon = "spuriousDragon",
  tangerineWhistle = "tangerineWhistle",
  homestead = "homestead",
}

enum Language { // TODO Remove duplicated
  Solidity = "Solidity",
  // Yul = 'Yul'
}

export const HomeView: React.FC = () => {
  const [selectedCompilerVersion, setSelectedCompilerVersion] = useState(
    COMPILER_VERSIONS[0].version
  ) // Set first as default
  const [compilerInstance, setCompilerInstance] = useState<
    Compiler | undefined
  >(undefined)
  const [compilerLoaded, setCompilerLoaded] = useState(false)

  const { clientInstance } = useRemix()

  useEffect(() => {
    const loadCompiler = async (compilerUrl: string) => {
      const compilerInstanceValue = new Compiler(clientInstance)
      setCompilerInstance(compilerInstanceValue)

      await compilerInstanceValue.loadVersion(compilerUrl)
      setCompilerLoaded(true)
      log("Compiler loaded correctly")
    }

    if (!compilerInstance && clientInstance) {
      const compilerUrl = COMPILER_VERSIONS.find(
        (s) => s.version === selectedCompilerVersion
      )?.url
      if (!compilerUrl) {
        throw new Error("Invalid compiler version")
      }
      loadCompiler(compilerUrl)
    }
  }, [
    compilerLoaded,
    clientInstance,
    compilerInstance,
    selectedCompilerVersion,
  ])

  // controls
  const [language, setLanguage] = useState(Language.Solidity)
  const [, setSelectedEVMVersion] = useState(EVMVersion.homestead)
  const [autoCompile, setAutocompile] = useState(false)
  const [optimize, setOptimize] = useState(false)
  const [showWarnings, setShowWarnings] = useState(false)
  const [runs, setRuns] = useState(DEFAULT_RUNS)

  // flow
  // TODO const [isSolFileSelected, setIsSolFileSelected] = useState() // TODO: Initially I need to call Remix API Client to know
  const [currentFileName, setCurrentFileName] = useState<string | undefined>() // TODO
  const [isCompiling, setIsCompiling] = useState(false)

  const autoCompileRef = useRef(autoCompile)
  autoCompileRef.current = autoCompile

  useEffect(() => {
    log("clientInstance", clientInstance)
    if (clientInstance && clientInstance.on) {
      clientInstance.on("fileManager", "currentFileChanged", (file: string) => {
        log("Current file changed", file)
        setCurrentFileName(file)
      })

      clientInstance.on("fileManager", "currentFileChanged", (file: string) => {
        if (autoCompileRef.current) {
          setIsCompiling(true)
        }
      })
    }
  }, [clientInstance])

  const onChangeCompilerVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompilerVersion(e.target.value)
  }

  const onChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
  }

  const onChangeRuns = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuns(parseInt(e.target.value, 10))
  }

  const onChangeEvmVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEVMVersion(e.target.value as EVMVersion)
  }

  const onCompileClick = () => {
    setIsCompiling(true)
  }

  const [compilationResult, setCompilationResult] = useState<
    CompilationResult | undefined
  >(undefined)

  useEffect(() => {
    if (isCompiling && compilerInstance) {
      const setStatusToLoading = () => {
        clientInstance.emit("statusChanged", {
          key: "loading",
          type: "info",
          title: `Compilation in progress`,
        })
      }

      const setStatusToSuccess = () => {
        clientInstance.emit("statusChanged", {
          key: "succeed",
          type: "success",
          title: `Compilation finished`,
        })
      }

      const setStatusToFailed = () => {
        clientInstance.emit("statusChanged", {
          key: "failed",
          type: "error",
          title: `Compilation finished`,
        })
      }

      const addAnnotations = async (errors: CompilationError[]) => {
        errors.forEach(async (item) => {
          // extract line / column
          if (item.formattedMessage) {
            let position = item.formattedMessage.match(
              /^(.*?):([0-9]*?):([0-9]*?)?/
            )
            const errorLine = position ? parseInt(position[2], 10) - 1 : -1
            const errorColumn = position ? parseInt(position[3], 10) : -1

            position = item.formattedMessage.match(/^(https:.*?|http:.*?|.*?):/)
            // To think if I need this: const errorFile = position ? position[1] : ''

            await clientInstance.call("editor", "addAnnotation" as any, {
              row: errorLine,
              column: errorColumn,
              text: item.formattedMessage,
              type: "error",
            })
          }
        })
      }

      const clearAnnotations = async () => {
        await clientInstance.call("editor", "clearAnnotations" as any)
      }

      const compile = async () => {
        const currentFile = currentFileName
          ? currentFileName
          : await clientInstance.fileManager.getCurrentFile()
        console.log("Current file onCompile click", currentFile)

        if (!hasSolidityExtension(currentFile)) return

        setStatusToLoading()
        await clearAnnotations()
        // Pending: Set compiler version from Pragma
        const content = await clientInstance.fileManager.readFile(currentFile)
        const sources = { [currentFile]: { content } }
        const result = await compilerInstance.compile(sources as any, {
          // TODO FIx this types
          runs,
          optimize,
          evmVersion: null, // TODO FIx this types
          language,
        })
        log("CompilationResult", result)
        setCompilationResult(result)
        setIsCompiling(false)

        if (result.errors) {
          setStatusToFailed()
          await addAnnotations(result.errors)
        } else {
          setStatusToSuccess()
        }
      }

      setTimeout(() => {
        compile()
      }, 1000)
    }
  }, [
    isCompiling,
    clientInstance,
    compilerInstance,
    currentFileName,
    language,
    optimize,
    runs,
  ])

  if (!compilerLoaded) {
    return <h1>Loading...</h1>
  }

  return (
    <React.Fragment>
      <StyledSection>
        {compilerLoaded && (
          <article>
            <header className="compilerSection border-bottom">
              <div className="mb-2">
                <label
                  className="compilerLabel form-check-label"
                  htmlFor="versionSelector"
                >
                  Compiler
                </label>
                {/* Select Compiler Version, Note: Initially there is going to be just 1 version, so we just disable the select */}
                <select
                  onChange={onChangeCompilerVersion}
                  className="custom-select"
                  id="versionSelector"
                  disabled={true}
                  defaultValue={selectedCompilerVersion}
                >
                  {COMPILER_VERSIONS.map((item) => {
                    return (
                      <option
                        key={item.version}
                        disabled={true}
                        value={item.version}
                      >
                        {item.version}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="mb-2">
                <label
                  className="compilerLabel form-check-label"
                  htmlFor="compilierLanguageSelector"
                >
                  Language
                </label>
                {/* Select Language, Note: Disable Yul for the moment */}
                <select
                  onChange={onChangeLanguage}
                  className="custom-select"
                  id="compilierLanguageSelector"
                  disabled={true}
                >
                  <option>Solidity</option>
                </select>
              </div>

              <div className="mb-2">
                <label
                  className="compilerLabel form-check-label"
                  htmlFor="evmVersionSelector"
                >
                  EVM Version
                </label>
                {/* Select EVM Version */}
                <select
                  onChange={onChangeEvmVersion}
                  className="custom-select"
                  id="evmVersionSelector"
                  disabled={true}
                >
                  {Object.entries(EVMVersion).map((item) => {
                    const key = item[0]
                    const value = item[1]
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="mt-3">
                <p className="mt-2 compilerLabel">Compiler Configuration</p>
                <div className="mt-2 compilerConfig custom-control custom-checkbox">
                  {/* Autocompile */}
                  <input
                    className="autocompile custom-control-input"
                    onChange={() => setAutocompile(!autoCompile)}
                    data-id="compilerContainerAutoCompile"
                    id="autoCompile"
                    type="checkbox"
                    title="Auto compile"
                  />
                  <label
                    className="form-check-label custom-control-label"
                    htmlFor="autoCompile"
                  >
                    Auto compile
                  </label>
                </div>
                <div className="mt-2 compilerConfig custom-control custom-checkbox">
                  <div className="justify-content-between align-items-center d-flex">
                    {/* Optimize */}
                    <input
                      onChange={() => setOptimize(!optimize)}
                      className="custom-control-input"
                      id="optimize"
                      type="checkbox"
                    />
                    <label
                      className="form-check-label custom-control-label"
                      htmlFor="optimize"
                    >
                      Enable optimization
                    </label>
                    {/* Runs */}
                    <input
                      min="1"
                      className="custom-select ml-2 runs"
                      id="runs"
                      placeholder="200"
                      type="number"
                      title="Number of optimisation runs."
                      onChange={onChangeRuns}
                    />
                  </div>
                </div>
                <div className="mt-2 compilerConfig custom-control custom-checkbox">
                  {/* Hide warning box */}
                  <input
                    className="autocompile custom-control-input"
                    onChange={() => setShowWarnings(!showWarnings)}
                    id="hideWarningsBox"
                    type="checkbox"
                    title="Hide warnings"
                  />
                  <label
                    className="form-check-label custom-control-label"
                    htmlFor="hideWarningsBox"
                  >
                    Hide warnings
                  </label>
                </div>
              </div>
              {/* Compilation Button */}
              <button
                id="compileBtn"
                data-id="compilerContainerCompileBtn"
                className="btn btn-primary btn-block mt-3"
                onClick={onCompileClick}
                disabled={!currentFileName}
              >
                <span>
                  <FontAwesomeIcon
                    className={isCompiling ? "spinningIcon icon" : "icon"}
                    icon={faSync}
                  />{" "}
                  Compile{" "}
                  {currentFileName
                    ? getCleanedFileName(currentFileName)
                    : "<no file selected>"}
                </span>
              </button>
            </header>
          </article>
        )}
      </StyledSection>

      <ResultsSection compilationResult={compilationResult} />
    </React.Fragment>
  )
}
