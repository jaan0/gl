// Tiny persisted queue for grocery-list actions (toggle bought / remove)
// taken while offline. Flushed once the browser reports it's back online.

const KEY = 'grocery-offline-queue';

export type OfflineAction =
  | { type: 'toggle'; id: number; currentStatus: boolean }
  | { type: 'remove'; id: number };

export function getQueue(): OfflineAction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OfflineAction[]) : [];
  } catch {
    return [];
  }
}

export function queueAction(action: OfflineAction) {
  if (typeof window === 'undefined') return;
  const queue = getQueue();
  queue.push(action);
  window.localStorage.setItem(KEY, JSON.stringify(queue));
}

export function clearQueue() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
