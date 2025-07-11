export interface AuditIssue {
  id: string;
  type: string;
  message: string;
  severity: 'Error' | 'Warning' | 'Information';
  line: number;
  file: string;
}
