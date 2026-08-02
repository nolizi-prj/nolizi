/**
 * SPEC-0001 §6 — mandatory environment declaration.
 *
 * This suite is not a function of the implementation alone. It depends on the
 * IANA tzdata version, which changes offsets for historical and future dates,
 * so identical code passes on one machine and fails on another. That is not a
 * flake; it is a category of test whose truth is environment-relative.
 *
 * Callers assert the version and fail loudly. A skip is not acceptable — a
 * silently skipped timezone test is worse than a failing one.
 */

export const PINNED_TZDATA = '2026a';

export function runtimeTzdataVersion(): string | undefined {
  return (process as NodeJS.Process & { versions: { tz?: string } }).versions.tz;
}

export interface TzdataCheck {
  pinned: string;
  runtime: string | undefined;
  matches: boolean;
}

export function checkTzdata(): TzdataCheck {
  const runtime = runtimeTzdataVersion();
  return { pinned: PINNED_TZDATA, runtime, matches: runtime === PINNED_TZDATA };
}
