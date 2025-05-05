import type { Comic } from "@/models/Comic";
import type { LibraryStatus } from "./type";
import type { Chapter } from "@/models/Chapter";

export const DB_NAME = 'mangaLibrary';
export const DB_VERSION = 2;
export const COMICS_STORE = 'comics';
export const LIBRARY_STORE = 'library';
export const HISTORY_STORE = 'history';

const NON_UPDATABLE = ['id', 'following', 'favorites', 'pinned'] as const;
type NonUpdatableField = typeof NON_UPDATABLE[number];

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const oldVersion = event.oldVersion;

            if (oldVersion < 1) {
                if (!db.objectStoreNames.contains(COMICS_STORE)) {
                    db.createObjectStore(COMICS_STORE, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
                    db.createObjectStore(LIBRARY_STORE, { keyPath: 'comicId' });
                }
            }

            if (oldVersion < 2) {
                if (!db.objectStoreNames.contains(HISTORY_STORE)) {
                    const historyStore = db.createObjectStore(HISTORY_STORE, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    historyStore.createIndex('comicId', 'comicId', { unique: false });
                    historyStore.createIndex('comicChapter', ['comicId', 'chapterId'], { unique: false });
                }

                if (oldVersion >= 1 && db.objectStoreNames.contains(LIBRARY_STORE)) {
                    const tx = (event.target as IDBOpenDBRequest).transaction;
                    if (tx) {
                        const libraryStore = tx.objectStore(LIBRARY_STORE);
                        const historyStore = tx.objectStore(HISTORY_STORE);

                        const cursorRequest = libraryStore.openCursor();
                        cursorRequest.onsuccess = (e: Event) => {
                            const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
                            if (cursor) {
                                const oldData = cursor.value;
                                if (oldData) {
                                    const newLibraryStatus: LibraryStatus = {
                                        comicId: oldData.comicId,
                                        favorite: oldData.statuses?.favorite || false,
                                        following: oldData.statuses?.following || false,
                                        readingStatus: 'none'
                                    };

                                    if (oldData.statuses?.completed) newLibraryStatus.readingStatus = 'completed';
                                    else if (oldData.statuses?.reading) newLibraryStatus.readingStatus = 'reading';
                                    else if (oldData.statuses?.planning) newLibraryStatus.readingStatus = 'planning';

                                    libraryStore.put(newLibraryStatus);

                                    if (oldData.chapters) {
                                        for (const chapterId in oldData.chapters) {
                                            historyStore.add({
                                                comicId: oldData.comicId,
                                                chapterId,
                                                readingProgress: oldData.chapters[chapterId].readingProgress,
                                                timestamp: Date.now()
                                            });
                                        }
                                    }
                                }
                                cursor.continue();
                            }
                        };
                    }
                }
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function cacheComics(comics: Comic[]) {
    const db = await openDB();
    const tx = db.transaction(COMICS_STORE, 'readwrite');
    const store = tx.objectStore(COMICS_STORE);

    await Promise.all(
        comics.map(
            (comic) =>
                new Promise<void>((resolve, reject) => {
                    const getReq = store.get(comic.id);
                    getReq.onsuccess = () => {
                        const existing = getReq.result as Comic | undefined;
                        let toStore = comic;
                        if (existing) {
                            toStore = { ...existing, ...comic };
                            for (const field of NON_UPDATABLE) {
                                (toStore as Record<NonUpdatableField, any>)[field] = existing[field as keyof Comic];
                            }
                        }
                        const putReq = store.put(toStore);
                        putReq.onsuccess = () => resolve();
                        putReq.onerror = () => reject(putReq.error);
                    };
                    getReq.onerror = () => reject(getReq.error);
                })
        )
    );

    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getComic(id: number): Promise<Comic | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(COMICS_STORE, 'readonly');
        const store = tx.objectStore(COMICS_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function getComicsByFlag(flag: 'favorite' | 'following'): Promise<number[]> {
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
                if (data[flag]) {
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

export async function getLibraryStatus(comicId: number): Promise<LibraryStatus | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(LIBRARY_STORE, 'readonly');
        const store = tx.objectStore(LIBRARY_STORE);
        const req = store.get(comicId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function updateLibraryField(
    comicId: number,
    field: 'favorite' | 'following',
    value: boolean
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

        data[field] = value;
        store.put(data);
    };

    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}