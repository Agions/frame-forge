/**
 * Shim for `@/shared/components/ui/alert`.
 *
 * The canonical location is now `@/components/ui/alert`. This shim exists
 * only to keep existing deep imports working while callers are migrated, and
 * is itself a cleanup candidate for a later task.
 */

export * from '@/components/ui/alert';
