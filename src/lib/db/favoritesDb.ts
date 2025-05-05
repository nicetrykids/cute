import { updateLibraryField, getComicsByFlag } from "./indexedDbBase";

export async function toggleFavorite(comicId: number, value: boolean): Promise<void> {
  return updateLibraryField(comicId, 'favorite', value);
}

export async function getFavoriteComics(): Promise<number[]> {
  return getComicsByFlag('favorite');
}


