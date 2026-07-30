/**
 * Shim for `@/shared/components/ui/confirm-dialog`.
 *
 * The canonical location is now `@/components/ui/confirm-dialog`. This shim exists
 * only to keep existing deep imports working while callers are migrated, and
 * is itself a cleanup candidate for a later task.
 */

export * from '@/components/ui/confirm-dialog';
