import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new OllamaChatProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      OllamaChatProvider.viewType,
      provider
    )
  );
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

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.makeHTML(webviewView.webview);
  }

  private makeHTML(webview: vscode.Webview) {
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
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
