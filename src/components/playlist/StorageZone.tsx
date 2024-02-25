import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { useEffect, useState } from "react";
import { ref, list, StorageReference, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VIDEO_REF = ref(storage, "video");
const STORAGE_PAGE_SIZE = 5;

export default function StorageZone() {
  const [refList, setRefList] = useState<StorageReference[][] | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [currentStoragePage, setCurrentStoragePage] = useState<number>(0);
  const [isGettingNextStoragePage, setIsGettingNextStoragePage] =
    useState<boolean>(true);
  const [nextStoragePageToken, setNextStoragePageToken] = useState<
    string | undefined
  >(undefined);

  const goToNextStoragePage = async () => {
    if (!refList) return;
    if (currentStoragePage + 1 < refList.length) {
      setCurrentStoragePage(currentStoragePage + 1);
      return;
    }
    if (!nextStoragePageToken) return;
    setIsGettingNextStoragePage(true);
    const videoList = await list(VIDEO_REF, {
      maxResults: STORAGE_PAGE_SIZE,
      pageToken: nextStoragePageToken,
    });
    setNextStoragePageToken(videoList.nextPageToken);
    setRefList([...(refList as StorageReference[][]), videoList.items]);
    setCurrentStoragePage(currentStoragePage + 1);
    setIsGettingNextStoragePage(false);
  };

  const getVideoUrl = async (videoRef: StorageReference) => {
    const videoUrl = await getDownloadURL(videoRef);
    setPreviewVideo(videoUrl);
  };

  useEffect(() => {
    const load = async () => {
      const videoList = await list(VIDEO_REF, {
        maxResults: STORAGE_PAGE_SIZE,
      });
      setNextStoragePageToken(videoList.nextPageToken);
      setRefList([videoList.items]);
      setIsGettingNextStoragePage(false);
    };
    load();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between items-end">
          <h2 className="font-bold mb-2">Storage</h2>
          <div className="w-full flex flex-row items-center gap-3 justify-end">
            <button
              className="hover:bg-gray-300 rounded-lg w-10 h-10 border border-gray-500 transition-colors disabled:bg-gray-700"
              disabled={isGettingNextStoragePage || currentStoragePage === 0}
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
                isGettingNextStoragePage ||
                !refList ||
                (!nextStoragePageToken &&
                  currentStoragePage + 1 === refList.length)
              }
              onClick={goToNextStoragePage}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        <div className="w-full border-2 rounded-lg border-gray-400 p-5 flex flex-col items-start gap-2">
          {isGettingNextStoragePage && (
            <FontAwesomeIcon className="animate-spin w-full" icon={faSpinner} />
          )}
          {!isGettingNextStoragePage &&
            refList &&
            refList[currentStoragePage].length > 0 && (
              <>
                {refList[currentStoragePage].map((ref) => (
                  <button
                    key={ref.name}
                    onClick={() => getVideoUrl(ref)}
                    className="hover:bg-gray-300 transition-colors rounded-lg w-full p-2 text-left border border-gray-500"
                  >
                    {ref.name}
                  </button>
                ))}
              </>
            )}
        </div>
        {!isGettingNextStoragePage &&
          refList &&
          refList[currentStoragePage].length == 0 && (
            <p className="font-bold text-center">No video in storage yet</p>
          )}
      </div>
      {previewVideo && (
        <video src={previewVideo} controls className="w-full"></video>
      )}
    </>
  );
}
