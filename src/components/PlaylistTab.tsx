"use client";

import { useEffect, useRef, useState } from "react";
import {
  ref,
  listAll,
  StorageReference,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebaseStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

export default function PlaylistTab() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [refList, setRefList] = useState<StorageReference[] | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const videoRef = ref(storage, "video");
      const videoList = await listAll(videoRef);
      setRefList(videoList.items);
    };
    load();
  });

  const getVideoUrl = async (videoRef: StorageReference) => {
    const videoUrl = await getDownloadURL(videoRef);
    console.log(videoUrl);
    setPreviewVideo(videoUrl);
  };

  if (!refList)
    return <FontAwesomeIcon className="animate-spin" icon={faSpinner} />;
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-col gap-2">
        <h2 className="font-bold mb-2">Storage</h2>
        {refList.length > 0 && (
          <div className="w-full border-2 rounded-lg border-gray-400 p-5 flex flex-col items-start">
            {refList.map((ref) => (
              <button key={ref.name} onClick={() => getVideoUrl(ref)}>
                {ref.name}
              </button>
            ))}
          </div>
        )}
        {refList.length == 0 && (
          <p className="font-bold text-center">No video in storage yet</p>
        )}
      </div>

      {previewVideo && (
        <video
          ref={videoRef}
          src={previewVideo}
          controls
          className="w-full"
        ></video>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="font-bold mb-2">Playlist</h2>
        <div className="w-full border-2 rounded-lg border-gray-400 p-5">
          <p className="font-bold text-center">No video in playlist yet</p>
        </div>
      </div>
    </div>
  );
}
