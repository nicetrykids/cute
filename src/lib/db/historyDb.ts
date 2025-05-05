import type { Comic } from '@/models/Comic';
import { openDB, HISTORY_STORE, COMICS_STORE } from './indexedDbBase';
import type { HistoryEntry } from './type';
import type { Chapter } from '@/models/Chapter';

export async function addToHistory(
  comicId: number,
  chapterId: string,
  imageIndex: number
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(HISTORY_STORE, 'readwrite');
  const store = tx.objectStore(HISTORY_STORE);

  const entry: HistoryEntry = {
    comicId,
    chapterId,
    readingProgress: imageIndex,
    timestamp: Date.now()
  };

  const index = store.index('comicChapter');
  const existingRequest = index.getAll([comicId, chapterId]);

  existingRequest.onsuccess = () => {
    const existingEntries = existingRequest.result as HistoryEntry[];
    if (existingEntries && existingEntries.length > 0) {
      const latestEntry = existingEntries.reduce((latest, entry) =>
        latest.timestamp > entry.timestamp ? latest : entry, existingEntries[0]);

      if (latestEntry.id !== undefined) {
        latestEntry.readingProgress = imageIndex;
        latestEntry.timestamp = Date.now();
        store.put(latestEntry);
      }
    } else {
      store.add(entry);
    }
  };

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getChapterProgress(
  comicId: number,
  chapterId: string
): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const store = tx.objectStore(HISTORY_STORE);
    const index = store.index('comicChapter');
    const request = index.getAll([comicId, chapterId]);

    request.onsuccess = () => {
      const entries = request.result as HistoryEntry[];
      if (entries && entries.length > 0) {
        const latestEntry = entries.reduce((latest, entry) =>
          latest.timestamp > entry.timestamp ? latest : entry, entries[0]);
        resolve(latestEntry.readingProgress);
      } else {
        resolve(0);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getHistoryComics(limit: number = 50): Promise<number[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const store = tx.objectStore(HISTORY_STORE);
    const comicIds = new Set<number>();

    const request = store.getAll();
    request.onsuccess = () => {
      const entries = request.result as HistoryEntry[];

      entries.sort((a, b) => b.timestamp - a.timestamp);

      for (const entry of entries) {
        if (comicIds.size >= limit) break;
        comicIds.add(entry.comicId);
      }

      resolve(Array.from(comicIds));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getComicHistory(comicId: number): Promise<HistoryEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly');
    const store = tx.objectStore(HISTORY_STORE);
    const index = store.index('comicId');
    const request = index.getAll(comicId);

    request.onsuccess = () => {
      const entries = request.result as HistoryEntry[];
      entries.sort((a, b) => b.timestamp - a.timestamp);
      resolve(entries);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearHistory(comicId?: number): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(HISTORY_STORE, 'readwrite');
  const store = tx.objectStore(HISTORY_STORE);

  if (comicId !== undefined) {
    const index = store.index('comicId');
    const request = index.getAll(comicId);
    request.onsuccess = () => {
      const entries = request.result as HistoryEntry[];
      for (const entry of entries) {
        if (entry.id !== undefined) {
          store.delete(entry.id);
        }
      }
    };
  } else {
    store.clear();
  }

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getChapterByNumber(comicId: number, chapterNumber: number): Promise<Chapter | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COMICS_STORE, 'readonly');
    const store = tx.objectStore(COMICS_STORE);
    const request = store.get(comicId);

    request.onsuccess = () => {
      const comic = request.result as Comic;
      if (comic && comic.chapters) {
        const chapter = comic.chapters.find((ch: Chapter) => ch.chap === chapterNumber);
        resolve(chapter || null);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}