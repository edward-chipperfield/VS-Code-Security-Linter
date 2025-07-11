import * as vscode from 'vscode';
import { auditActiveFile } from './auditor';
import { AuditorCodeActionProvider } from './code-actions';

// Map string severity from LLM output to VS Code enum
const severityMap: { [key: string]: vscode.DiagnosticSeverity } = {
  Error: vscode.DiagnosticSeverity.Error,
  Warning: vscode.DiagnosticSeverity.Warning,
  Information: vscode.DiagnosticSeverity.Information
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension activated');

  const disposable = vscode.commands.registerCommand('auditor.auditFile', async () => {
    console.log('Audit command triggered');
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const document = editor.document;
    const results = await auditActiveFile(document);

    const diagnostics = results.map(result => {
      const range = new vscode.Range(result.line - 1, 0, result.line - 1, 100);
      const severity = severityMap[result.severity] ?? vscode.DiagnosticSeverity.Warning;
      const diagnostic = new vscode.Diagnostic(range, result.message, severity);
      diagnostic.code = result.id;
      diagnostic.source = 'LLM Auditor';
      return diagnostic;
    });

    const collection = vscode.languages.createDiagnosticCollection('auditor');
    collection.set(document.uri, diagnostics);

    if (diagnostics.length === 0) {
      vscode.window.showInformationMessage('No security or accessibility issues found.');
    }
  });

  // Register quick fix support
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: 'javascript' },
      new AuditorCodeActionProvider(),
      {
        providedCodeActionKinds: AuditorCodeActionProvider.providedCodeActionKinds,
      }
    )
  );

  // Register ARIA fix command
  context.subscriptions.push(
    vscode.commands.registerCommand('auditor.addAriaAttribute', (document, range) => {
      const edit = new vscode.WorkspaceEdit();
      const pos = range.end;
      const insertText = ` aria-label="describe me"`;
      edit.insert(document.uri, pos, insertText);
      vscode.workspace.applyEdit(edit);
    })
  );

  context.subscriptions.push(disposable);
}



export function deactivate() {}
