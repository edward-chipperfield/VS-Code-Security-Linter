import * as vscode from 'vscode';

export class AuditorCodeActionProvider implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diag of context.diagnostics) {
      if (diag.message.includes('innerHTML')) {
        const fix = new vscode.CodeAction(
          '💡 Replace with textContent',
          vscode.CodeActionKind.QuickFix
        );
        fix.edit = new vscode.WorkspaceEdit();
        const original = document.getText(diag.range);
        const replaced = original.replace('innerHTML', 'textContent');
        fix.edit.replace(document.uri, diag.range, replaced);
        fix.diagnostics = [diag];
        fix.isPreferred = true;
        actions.push(fix);
      }

      if (diag.message.includes('Missing ARIA')) {
        const fix = new vscode.CodeAction(
          'Add aria-label',
          vscode.CodeActionKind.QuickFix
        );
        fix.command = {
          title: 'Add ARIA attribute',
          command: 'auditor.addAriaAttribute',
          arguments: [document, range],
        };
        fix.diagnostics = [diag];
        actions.push(fix);
      }
    }

    return actions;
  }
}
