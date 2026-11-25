import { GraphQLError } from 'graphql';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// "2026-03-03" -> Date at UTC midnight (what Postgres DATE expects via Prisma)
export function parseDateOnly(value: string | null | undefined, field: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00Z`);
  if (!DATE_RE.test(value) || Number.isNaN(d.getTime())) {
    throw new GraphQLError(`${field} must be YYYY-MM-DD`, { extensions: { code: 'BAD_USER_INPUT' } });
  }
  return d;
}

// Date -> "2026-03-03"
export function formatDateOnly(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}
