import { getComicsByFlag, updateLibraryField } from "./indexedDbBase";

export async function toggleFollowing(comicId: number, value: boolean): Promise<void> {
    return updateLibraryField(comicId, 'following', value);
  }
  
  
export async function getFollowingComics(): Promise<number[]> {
    return getComicsByFlag('following');
  }
  