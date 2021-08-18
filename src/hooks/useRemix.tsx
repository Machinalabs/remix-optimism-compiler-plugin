import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"

import { ThemeType, RemixClientInstanceType } from "../types"
import { log } from "../utils"

import { RemixClient } from "./RemixClient"

interface IRemixProvider {
  clientInstance: RemixClientInstanceType
  themeType: ThemeType
}

/* tslint:disable */
const RemixContext = React.createContext<IRemixProvider>({
  clientInstance: {} as RemixClientInstanceType,
  themeType: "dark" as ThemeType,
})
/* tslint:enable */

const PLUGIN_NAME = "Remix Optimism Compiler "

export const RemixProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [themeType, setThemeType] = useState<ThemeType>("dark")

  useEffect(() => {
    log(`${PLUGIN_NAME} loading...`)
    const loadClient = async () => {
      const client = new RemixClient()
      console.log("Client", client)
      await client.onload()
      log(`${PLUGIN_NAME} Plugin has been loaded`)

      setClientInstance(client)
      const currentTheme = await client.call("theme", "currentTheme")
      log("Current theme", currentTheme)

      setThemeType(currentTheme.brightness)
      client.on("theme", "themeChanged", (theme: any) => {
        log("themeChanged")
        setThemeType(theme.quality)
      })
    }

    loadClient().catch((error) => {
      log("Error", error)
      setClientInstance(undefined)
    })
  }, [])

  return (
    <RemixContext.Provider
      value={{
        clientInstance,
        themeType,
      }}
    >
      {children}
    </RemixContext.Provider>
  )
}

export const useRemix = () => {
  const context = useContext(RemixContext)

  if (context === null) {
    throw new Error(
      "useRemix() can only be used inside of <RemixProvider />, please declare it at a higher level"
    )
  }
  return context
}
