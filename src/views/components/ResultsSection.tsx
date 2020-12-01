import React from "react"

import { CompilationResult } from "@remixproject/plugin-api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-regular-svg-icons"
import { CopyToClipboard } from "react-copy-to-clipboard"

import { ContractSelection, getContractsList } from "./ContractSelection"
import { NoContractsArea, StyledButtonIcon, StyledSection } from "./Styled"

interface ResultsProps {
  compilationResult?: CompilationResult
}

export const ResultsSection: React.FC<ResultsProps> = ({
  compilationResult,
}) => {
  const getABI = (result: any) => {
    const contractList = result ? getContractsList(result.contracts) : undefined

    if (result && contractList) {
      const abi =
        result.contracts[contractList[0].fullFileName][contractList[0].name].abi
      return JSON.stringify(abi)
    }
  }

  const copyABI = () => {
    // addTooltip('Copied value to clipboard')
  }

  const copyBytecode = (contractList: any) => {
    // addTooltip('Copied value to clipboard')
  }

  const getBytecode = (result: any) => {
    const contractList = result ? getContractsList(result.contracts) : undefined

    if (result && contractList) {
      const bytecode =
        result.contracts[contractList[0].fullFileName][contractList[0].name].evm
          .bytecode.object
      return bytecode
    }
  }

  return (
    <React.Fragment>
      {compilationResult && compilationResult.contracts && (
        <StyledSection>
          <section className="compilerSection pt-3">
            <div>
              <label
                className="compilerLabel form-check-label"
                htmlFor="compiledContracts"
              >
                Contract
              </label>
              <ContractSelection contracts={compilationResult.contracts} />
            </div>
            <article className="mt-2 pb-0">
              <div className="contractHelperButtons">
                <div className="input-group">
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Copy to Clipboard"
                  >
                    <CopyToClipboard text={getABI(compilationResult) || ""}>
                      <StyledButtonIcon
                        className="btn copyButton"
                        title="Copy ABI to clipboard"
                        onClick={copyABI}
                      >
                        <FontAwesomeIcon
                          icon={faCopy}
                          style={{ marginRight: "5px" }}
                        />
                        <span>ABI</span>
                      </StyledButtonIcon>
                    </CopyToClipboard>

                    <CopyToClipboard
                      text={getBytecode(compilationResult) || ""}
                    >
                      <StyledButtonIcon
                        className="btn copyButton"
                        title="Copy Bytecode to clipboard"
                        onClick={copyBytecode}
                      >
                        <FontAwesomeIcon
                          icon={faCopy}
                          style={{ marginRight: "5px" }}
                        />
                        <span>Bytecode</span>
                      </StyledButtonIcon>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </StyledSection>
      )}
      {!compilationResult && (
        <NoContractsArea>
          <article className="px-2 mt-2 pb-0 d-flex">
            <span className="mt-2 mx-3 w-100 alert alert-warning" role="alert">
              No Contract Compiled Yet
            </span>
          </article>
        </NoContractsArea>
      )}
      {compilationResult && compilationResult.errors && (
        <div className="errorBlobs p-4" data-id="compiledErrors">
          {compilationResult.errors.map((item, index) => {
            if (item.severity === "error") {
              return (
                <div key={index} className="sol error alert alert-danger">
                  <span>{item.formattedMessage}</span>
                </div>
              )
            } else if (item.severity === "warning") {
              return (
                <div key={index} className="sol warning alert alert-warning">
                  <span>{item.formattedMessage}</span>
                </div>
              )
            } else {
              return (
                <div key={index}>
                  <span>{item.formattedMessage}</span>
                </div>
              )
            }
          })}
        </div>
      )}
    </React.Fragment>
  )
}
