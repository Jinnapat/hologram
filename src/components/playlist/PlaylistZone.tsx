import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import {
  collection,
  query,
  orderBy,
  startAt,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseStorage";

const PLAYLIST_PAGE_SIZE = 5;

export default function PlaylistZone() {
  const [playlist, setPlaylist] = useState<string[] | undefined>(undefined);
  const [currentPlaylistPage, setCurrentPlaylistPage] = useState<number>(0);
  const [isGettingNextPlaylistPage, setIsGettingNextPlayListPage] =
    useState<boolean>(true);

  const getPlaylistPage = (page: number) => {
    const next = query(
      collection(db, "playlist"),
      orderBy("population"),
      startAt(page * PLAYLIST_PAGE_SIZE),
      limit(PLAYLIST_PAGE_SIZE)
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between items-end">
        <h2 className="font-bold mb-2">Playlist</h2>
        <div className="w-full flex flex-row items-center gap-3 justify-end">
          <button
            className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
            disabled={isGettingNextPlaylistPage || currentPlaylistPage === 0}
            onClick={() =>
              setCurrentPlaylistPage(
                currentPlaylistPage ? currentPlaylistPage - 1 : 0
              )
            }
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
            disabled={isGettingNextPlaylistPage}
            onClick={() => setCurrentPlaylistPage(currentPlaylistPage + 1)}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
      <div className="w-full border-2 rounded-lg border-gray-400 p-5">
        <p className="font-bold text-center">No video in playlist yet</p>
      </div>
    </div>
  );
}
