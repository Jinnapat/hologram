"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { ChangeEventHandler, useRef, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function PlaylistTab() {
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

  return <></>;
}
