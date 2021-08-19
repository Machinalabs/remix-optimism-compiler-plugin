import { PluginClient } from "@remixproject/plugin"
import { customAction } from "@remixproject/plugin-api"
import { createClient } from "@remixproject/plugin-webview"

export class RemixClient extends PluginClient {
  private compilerCallback: any

  constructor() {
    super()
    this.methods =  ["compileCustomAction"]
    createClient(this)
  }

  public setCompilerCallback(compileFunc: any) {
    this.compilerCallback = compileFunc
  }

  public async compileCustomAction(action: customAction) {
    if (action.path[0]) await this.compile(action.path[0])
  }

  public async compile(fileName: string) {
    if (this.compilerCallback) {
      await this.compilerCallback(fileName)
    }
  }
}
