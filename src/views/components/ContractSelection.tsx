import React, { useState } from "react"
import { CompiledContract } from "@remixproject/plugin-api"

import { getCleanedFileName } from "../../utils"

export interface ContractSelectionProps {
  contracts: CompilationContractsType
}

export interface CompilationContractsType {
  [fileName: string]: {
    [contract: string]: CompiledContract
  }
}

export const ContractSelection: React.FC<ContractSelectionProps> = ({
  contracts,
}) => {
  const [selectedContract, setSelectedContract] = useState("")

  const onCompiledContractsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedContract(e.target.value)
  }

  const contractList = contracts ? getContractsList(contracts) : []

  return (
    <select
      onChange={onCompiledContractsChange}
      data-id="compiledContracts"
      id="compiledContracts"
      value={selectedContract}
      className="custom-select"
    >
      $
      {contractList.map(({ name, file }) => {
        return <option key={name} value={name}>{`${name} (${file})`}</option>
      })}
    </select>
  )
}

export const getContractsList = (contracts: CompilationContractsType) => {
  return Object.keys(contracts).map((key: string) => {
    const justFileName = getCleanedFileName(key)
    if (!justFileName) {
      throw new Error("No contract")
    }

    // const fileWithoutExtension = justFileName.replace('.sol', '')

    return {
      name: Object.keys(contracts[key])[0],
      file: justFileName,
      fullFileName: key,
    }
  })
}
