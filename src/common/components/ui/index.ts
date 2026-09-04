/**
 * Transition barrel for `src/shared/components/ui`.
 *
 * The canonical location is now `@/components/ui/*`. This barrel exists only
 * to keep old `@/common/components/ui` imports working while callers are
 * migrated, and is itself a cleanup candidate for a later task.
 */

export { Button as SharedButton } from '@/components/ui/button';
export { Card as SharedCard } from '@/components/ui/card';
export * from '@/components/ui/confirm-dialog';
export * from '@/components/ui/empty';
export { default as Loading, PageSkeleton as LoadingSpinner } from '@/components/ui/loading';
export { default as Skeleton, SkeletonComponent } from '@/components/ui/skeleton';
export * from '@/components/ui/toast';
export { EmptyState } from '@/components/ui/empty';
