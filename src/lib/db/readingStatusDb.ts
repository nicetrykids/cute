import { openDB, LIBRARY_STORE } from './indexedDbBase';
import type { LibraryStatus, ReadingStatus } from './type';

export async function setReadingStatus(
  comicId: number,
  status: ReadingStatus
): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(LIBRARY_STORE, 'readwrite');
  const store = tx.objectStore(LIBRARY_STORE);
  const req = store.get(comicId);
  req.onsuccess = () => {
    let data: LibraryStatus =
      req.result || {
        comicId,
        favorite: false,
        following: false,
        readingStatus: 'none'
      };

    data.readingStatus = status;
    store.put(data);
  };

  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPlanningComics(): Promise<number[]> {
  return getComicsByReadingStatus('planning');
}

export async function getReadingComics(): Promise<number[]> {
  return getComicsByReadingStatus('reading');
}

export async function getCompletedComics(): Promise<number[]> {
  return getComicsByReadingStatus('completed');
}

async function getComicsByReadingStatus(
  status: ReadingStatus
): Promise<number[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIBRARY_STORE, 'readonly');
    const store = tx.objectStore(LIBRARY_STORE);
    const comics: number[] = [];

    const cursorRequest = store.openCursor();
    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        const data = cursor.value as LibraryStatus;
        if (data.readingStatus === status) {
          comics.push(data.comicId);
        }
        cursor.continue();
      } else {
        resolve(comics);
      }
    };
    cursorRequest.onerror = () => reject(cursorRequest.error);
  });
} 