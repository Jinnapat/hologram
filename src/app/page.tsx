"use client";

import FileUploadTab from "@/components/FileUploadTab";
import PlaylistTab from "@/components/PlaylistTab";
import { useState } from "react";

export default function Home() {
  const [isInUploadTab, setIsUploadTab] = useState<boolean>(true);

  return (
    <div className="flex flex-col rounded-xl shadow-lg bg-gray-200 max-w-3xl w-full p-7 items-center gap-y-7">
      <div className="flex flex-row w-full gap-3 justify-between rounded-full">
        <button
          onClick={() => setIsUploadTab(true)}
          className={
            "p-2 text-white  transition-colors duration-300  w-full rounded-full" +
            (!isInUploadTab
              ? " bg-gray-600 hover:bg-gray-700"
              : " bg-blue-600 hover:bg-blue-700")
          }
        >
          upload
        </button>
        <button
          onClick={() => setIsUploadTab(false)}
          className={
            "p-2 text-white  transition-colors duration-300  w-full rounded-full" +
            (isInUploadTab
              ? " bg-gray-600 hover:bg-gray-700"
              : " bg-blue-600 hover:bg-blue-700")
          }
        >
          playlist
        </button>
      </div>
      <div className="border h-0 border-gray-400 w-full"></div>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl">
          {isInUploadTab ? "Upload New Video" : "Manage your playlist"}
        </h1>
        <p className="text-center">
          {isInUploadTab
            ? "select a video to be uploaded to our storage. Maximum file size is 50mb"
            : "add or remove videos from your playlist queue"}
        </p>
      </div>
      {isInUploadTab && <FileUploadTab />}
      {!isInUploadTab && <PlaylistTab />}
    </div>
  );
}
