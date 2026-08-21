import { cn, formatDueDate, isOverdue } from '../lib/utils';

describe('cn', () => {
  it('merges class names and lets the later Tailwind utility win on conflicts', () => {
    expect(cn('px-2 text-white', 'px-4')).toBe('text-white px-4');
  });

  it('drops falsy values', () => {
    expect(cn('block', false && 'hidden', undefined, 'text-sm')).toBe('block text-sm');
  });
});

describe('formatDueDate', () => {
  it('returns a placeholder when there is no due date', () => {
    expect(formatDueDate(null)).toBe('No due date');
    expect(formatDueDate(undefined)).toBe('No due date');
  });

  it('labels today and tomorrow explicitly', () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(formatDueDate(today.toISOString())).toBe('Due today');
    expect(formatDueDate(tomorrow.toISOString())).toBe('Due tomorrow');
  });

  it('flags a past date as overdue with a day count', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    expect(formatDueDate(threeDaysAgo.toISOString())).toBe('Overdue by 3d');
  });
});

describe('isOverdue', () => {
  it('is false when there is no due date', () => {
    expect(isOverdue(null, 'PENDING')).toBe(false);
  });

  it('is false once the task is marked DONE, even past the due date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(isOverdue(yesterday.toISOString(), 'DONE')).toBe(false);
  });

  it('is true for a past due date on an unfinished task', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(isOverdue(yesterday.toISOString(), 'PENDING')).toBe(true);
  });
});
