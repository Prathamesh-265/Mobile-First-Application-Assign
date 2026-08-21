export function taskCompletedTemplate(userName: string, taskTitle: string): { subject: string; html: string } {
  return {
    subject: `Task completed: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Nice work!</h2>
        <p>Hi ${userName},</p>
        <p>You marked <strong>${taskTitle}</strong> as done. One less thing on your plate.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">Task Manager</p>
      </div>
    `,
  };
}
