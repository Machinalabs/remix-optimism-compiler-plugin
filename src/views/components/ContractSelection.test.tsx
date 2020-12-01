import React from "react"
import { render } from "@testing-library/react"

import {
  CompilationContractsType,
  ContractSelection,
  getContractsList,
} from "./ContractSelection"
import SampleResult from "./contractResultSample.json"

describe("ContractSelection tests", () => {
  test("snapshot", () => {
    const { container } = render(
      <ContractSelection
        contracts={(SampleResult as any) as CompilationContractsType}
      />
    )

    expect(container).toMatchSnapshot()
  })

  test("getContractsList", () => {
    const result = getContractsList(SampleResult as any)

    expect(result).toBeDefined()
    expect(result.length).toEqual(1)
    expect(result[0].file).toBeDefined()
    expect(result[0].name).toBeDefined()
  })

  test("component is rendered correctly", async () => {
    const { getByText } = render(
      <ContractSelection
        contracts={(SampleResult as any) as CompilationContractsType}
      />
    )

    const result = getContractsList(SampleResult as any)
    const selectName = `${result[0].name} (${result[0].file})`

    expect(getByText(`${selectName}`)).toBeInTheDocument()
  })
})
