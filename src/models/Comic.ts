import type { AltName } from "./AltName";
import type { Chapter } from "./Chapter";

export interface Comic {
    title: string;
    createtime: string;
    author: string;
    mangadex_url: string;
    pinned: boolean;
    favorites: boolean;
    following: boolean;
    status: string;
    alt_names: AltName[];
    id: number;
    chapters: Chapter[];
    publication_year?: number;
    type?: string;
    original_language?: string;
    content_rating?: string;
    star?: number;
    demographics?: string[];
    arts?: string[];
    genres?: string[];
    themes?: string[];
    formats?: string[];
    artists?: string[];
    tags?: string[];
    comments?: any[];
    description?: string;
    updated_at?: string;
    latest_chapter_at?: string;
}