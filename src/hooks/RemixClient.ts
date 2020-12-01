import { PluginClient } from "@remixproject/plugin"
import { createClient } from "@remixproject/plugin-iframe"

export class RemixClient extends PluginClient {
  // methods = ["compileTest"]

  constructor() {
    super() // profile pending

    createClient(this)
  }
}
