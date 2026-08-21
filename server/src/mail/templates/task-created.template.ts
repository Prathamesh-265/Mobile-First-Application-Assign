// Plain functions instead of a template engine - one less dependency to
// configure, and the assignment doesn't call for anything fancier than
// a readable confirmation email.
export function taskCreatedTemplate(userName: string, taskTitle: string): { subject: string; html: string } {
  return {
    subject: `Task created: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">New task added</h2>
        <p>Hi ${userName},</p>
        <p>Your task <strong>${taskTitle}</strong> has been created successfully.</p>
        <p>You can track its progress from your dashboard.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">Task Manager</p>
      </div>
    `,
  };
}
