export {
  getComic,
  getComicsByFlag,
  cacheComics,
  getLibraryStatus,
  getChapterByNumber,
} from './indexedDbBase';

export {
  addToHistory,
  getChapterProgress,
  getHistoryComics,
  getComicHistory,
  clearHistory
} from './historyDb';

export {
  toggleFavorite,
  getFavoriteComics,
} from './favoritesDb';

export {
  toggleFollowing,
  getFollowingComics,
} from './followingDb';

export {
  setReadingStatus,
  getPlanningComics,
  getReadingComics,
  getCompletedComics
} from './readingStatusDb'; 