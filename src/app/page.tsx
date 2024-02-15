"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEventHandler, useRef, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const selectFile = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const fileList = e.currentTarget.files;
    if (!fileList) return;
    setFile(fileList[0]);
  };

  const upload = async () => {
    setErrorMessage("");
    setIsProcessing(true);
    if (!file) return;
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("video", file);
    const uploadResult = await fetch("/api/video", {
      method: "POST",
      body: formData,
    });
    setIsProcessing(false);
    console.log(uploadResult);
    if (uploadResult.status != 200) {
      setErrorMessage(await uploadResult.text());
      return;
    }
    setFile(null);
    setShowPopup(true);
  };

  return (
    <div className="w-full flex flex-col items-center p-5">
      <input
        type="file"
        hidden
        accept="video/*"
        ref={inputRef}
        onChange={handleFileChange}
      />
      <div className="flex flex-col rounded-lg shadow-lg bg-gray-200 max-w-3xl w-full p-7 items-center gap-y-7">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl">Upload New Video</h1>
          <p>select a video to be uploaded to our storage</p>
        </div>
        <div className="border h-0 border-gray-400 w-full"></div>
        {!file && (
          <button
            className="rounded-lg bg-red-500 hover:bg-red-600 p-5 w-48 transition-colors duration-300 h-48 flex flex-col items-center justify-center"
            onClick={selectFile}
          >
            <Image
              src="/video-chat.png"
              width={100}
              height={100}
              alt="upload image"
            />
            <p className="text-white">select a video</p>
          </button>
        )}
        {file && <video src={URL.createObjectURL(file)}></video>}
        <div className="flex flex-row justify-evenly items-center gap-5">
          <button
            onClick={selectFile}
            disabled={isProcessing}
            className="bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 p-3 text-white transition-colors duration-300 disabled:bg-gray-500 disabled:text-gray-200"
          >
            {file ? "Change video" : "Select video"}
          </button>
          <button
            className="bg-green-500 rounded-lg shadow-md hover:bg-green-600 p-3 text-white transition-colors duration-300 disabled:bg-gray-500 disabled:text-gray-200 flex flex-row gap-2 justify-center items-center"
            onClick={upload}
            disabled={file == null || isProcessing}
          >
            {isProcessing && (
              <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
            )}
            Upload video
          </button>
        </div>
        <p className="text-red-700">{errorMessage}</p>
      </div>
      {showPopup && (
        <div className="bg-gray-100 rounded-2xl shadow-xl flex flex-col items-center p-8 absolute border-2 top-10 gap-6 w-80">
          <p className="font-bold text-2xl">Upload Successful</p>
          <Image
            src="/high-five.png"
            alt="successful image icon"
            width={200}
            height={200}
          />
          <p className="text-center">
            Your video have been uploaded successfully. Close this window the
            upload more video!
          </p>
          <button
            className="rounded-lg bg-blue-600 text-white p-3"
            onClick={() => setShowPopup(false)}
          >
            Awesome!
          </button>
        </div>
      )}
    </div>
  );
}
