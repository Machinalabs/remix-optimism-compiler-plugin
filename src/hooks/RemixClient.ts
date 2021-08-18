import { PluginClient } from "@remixproject/plugin"
import { createClient } from "@remixproject/plugin-webview";

export class RemixClient extends PluginClient {
  private compilerCallback: any

  constructor() {
    super()

    createClient(this)
  }

  public setCompilerCallback(compileFunc: any) {
    this.compilerCallback = compileFunc
  }

  public async compile(fileName: string) {
    if (this.compilerCallback) {
      await this.compilerCallback(fileName)
    }
  }
}
