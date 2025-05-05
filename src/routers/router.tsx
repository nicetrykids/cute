import SideBarLayout from "@/layouts/side-bar-layout";
import {
    createBrowserRouter,
} from "react-router";
import HomePage from "@/pages/home";
import ComicsPage from "@/pages/comics";
import ChaptersPage from "@/pages/chapters";
import ChapterPage from "@/pages/chapter";
import SettingsPage from "@/pages/settings";
import LibraryPage from "@/pages/library";
import { path } from "./path";

export const AppRouter = createBrowserRouter([
    {
        path: path.home,
        element: <SideBarLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: path.comics.slice(1),
                element: <ComicsPage />,
            },
            {
                path: path.chapters.slice(1),
                element: <ChaptersPage />,
            },
            {
                path: path.chapter.slice(1),
                element: <ChapterPage />,
            },
            {
                path: path.settings.slice(1),
                element: <SettingsPage />,
            },
            {
                path: path.library.slice(1),
                element: <LibraryPage />,
            },
        ],
    },
]);

