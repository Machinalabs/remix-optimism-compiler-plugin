import React from "react"
import { render } from "@testing-library/react"

import { HomeView } from "./HomeView"

describe("Home view tests", () => {
  test("snapshot", () => {
    const { container } = render(<HomeView />)

    expect(container).toMatchSnapshot()
  })
})
