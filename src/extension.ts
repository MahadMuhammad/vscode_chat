import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new OllamaChatProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      OllamaChatProvider.viewType,
      provider
    )
  );

  //////////////////////////////////////////////////////////

  context.subscriptions.push(
    vscode.commands.registerCommand(OllamaChatProvider.viewType, () => {
      const message = "Menu/Title of extension is clicked !";
      vscode.window.showInformationMessage(message);
    })
  );

  // Command has been defined in the package.json file
  // Provide the implementation of the command with registerCommand
  // CommandId parameter must match the command field in package.json
  let openWebView = vscode.commands.registerCommand("chat.refresh", () => {
    // Display a message box to the user
    vscode.window.showInformationMessage(
      'Command " Sidebar View [vscodeSidebar.openview] " called.'
    );
  });

  context.subscriptions.push(openWebView);

  context.subscriptions.push(
    vscode.commands.registerCommand("chat.refreshEntry", () =>
      provider.refresh()
    )
  );

  //////////////////////////////////////////////////////////

  console.log("activated");

  console.log('Congratulations, your extension "chat" is now active!');

  const disposable = vscode.commands.registerCommand("chat.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from chat!");
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

class OllamaChatProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "chat.chat";

  private view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  private _onDidChange: vscode.EventEmitter<
    vscode.WebviewViewProvider | undefined | void
  > = new vscode.EventEmitter<undefined | void | vscode.WebviewViewProvider>();

  readonly onDidChange: vscode.Event<
    vscode.WebviewViewProvider | undefined | void
  > = this._onDidChange.event;

  refresh(): void {
    this._onDidChange.fire(undefined);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.makeHTML(webviewView.webview);
  }

  private makeHTML(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "src", "app.js")
    );
    const markedUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "src", "marked.js")
    );
    const resetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "src", "reset.css")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "src", "style.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${resetUri}" rel="stylesheet">
        <link href="${styleUri}" rel="stylesheet">
        <title>Ollama Chat</title>
      </head>
      <body>
        <section id="feed">
          <h3>Hello World! 🤖</h3>
          <p>I am DevAI and all your chat remains private 🔐</p>
          <p>How cool is that?</p>
        </section>
        <form id="chat">
          <textarea placeholder="Type your message prompt here..." id="prompt" name="prompt"></textarea>
          <button type="submit">Send</button>
          <select id="models" name="model">
            <option> Select Model </option>
          </select>
        </form>    
        <script src="${markedUri}"></script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
