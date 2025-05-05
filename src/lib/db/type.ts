export type ReadingStatus = 'planning' | 'reading' | 'completed' | 'none';

export interface LibraryStatus {
    comicId: number;
    favorite: boolean;
    following: boolean;
    readingStatus: ReadingStatus;
}

export interface HistoryEntry {
    id?: number;
    comicId: number;
    chapterId: string;
    readingProgress: number;
    timestamp: number;
}