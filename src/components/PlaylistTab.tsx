"use client";

import { useEffect, useRef, useState } from "react";
import { ref, list, StorageReference, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";

const videoRef = ref(storage, "video");
const STORAGE_PAGE_SIZE = 5;

export default function PlaylistTab() {
  const videoInputRef = useRef<HTMLVideoElement>(null);
  const [refList, setRefList] = useState<StorageReference[][] | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [nextStoragePageToken, setNextStoragePageToken] = useState<
    string | undefined
  >(undefined);
  const [currentStoragePage, setCurrentStoragePage] = useState<number>(0);
  const [currentPlaylistPage, setCurrentPlaylistPage] = useState<number>(0);
  const [isGettingNextStoragePage, setIsGettingNextStoragePage] =
    useState<boolean>(false);

  const goToNextStoragePage = async () => {
    if (!refList) return;
    if (currentStoragePage + 1 < refList.length) {
      setCurrentStoragePage(currentStoragePage + 1);
      return;
    }
    if (!nextStoragePageToken) return;
    setIsGettingNextStoragePage(true);
    const videoList = await list(videoRef, {
      maxResults: STORAGE_PAGE_SIZE,
      pageToken: nextStoragePageToken,
    });
    setNextStoragePageToken(videoList.nextPageToken);
    setRefList([...(refList as StorageReference[][]), videoList.items]);
    setCurrentStoragePage(currentStoragePage + 1);
    setIsGettingNextStoragePage(false);
  };

  useEffect(() => {
    const load = async () => {
      const videoList = await list(videoRef, {
        maxResults: STORAGE_PAGE_SIZE,
      });
      setNextStoragePageToken(videoList.nextPageToken);
      setRefList([videoList.items]);
    };
    load();
  }, []);

  const getVideoUrl = async (videoRef: StorageReference) => {
    const videoUrl = await getDownloadURL(videoRef);
    setPreviewVideo(videoUrl);
  };

  if (!refList)
    return <FontAwesomeIcon className="animate-spin" icon={faSpinner} />;
  const currentRefList = refList[currentStoragePage];
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between items-end">
          <h2 className="font-bold mb-2">Storage</h2>
          <div className="w-full flex flex-row items-center gap-3 justify-end">
            <button
              className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
              disabled={currentStoragePage === 0}
              onClick={() =>
                setCurrentStoragePage(
                  currentStoragePage ? currentStoragePage - 1 : 0
                )
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
              disabled={
                !nextStoragePageToken &&
                currentStoragePage + 1 === refList.length
              }
              onClick={goToNextStoragePage}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        {currentRefList.length > 0 && (
          <div className="w-full border-2 rounded-lg border-gray-400 p-5 flex flex-col items-start gap-2">
            {isGettingNextStoragePage && (
              <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
            )}
            {!isGettingNextStoragePage &&
              currentRefList.map((ref) => (
                <button
                  key={ref.name}
                  onClick={() => getVideoUrl(ref)}
                  className="hover:bg-gray-300 transition-colors rounded-lg w-full p-2 text-left border border-gray-500"
                >
                  {ref.name}
                </button>
              ))}
          </div>
        )}
        {currentRefList.length == 0 && (
          <p className="font-bold text-center">No video in storage yet</p>
        )}
      </div>

      {previewVideo && (
        <video
          ref={videoInputRef}
          src={previewVideo}
          controls
          className="w-full"
        ></video>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-end">
          <h2 className="font-bold mb-2">Playlist</h2>
          <div className="w-full flex flex-row items-center gap-3 justify-end">
            <button
              className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
              disabled={currentPlaylistPage === 0}
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
    </div>
  );
}
