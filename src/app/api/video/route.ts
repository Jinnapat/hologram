import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

const firebaseConfig = {
  apiKey: "AIzaSyAgW21sG6wqBeyqSWbEgvTp-YHbvtTDxRo",
  authDomain: "hologram-a8137.firebaseapp.com",
  projectId: "hologram-a8137",
  storageBucket: "hologram-a8137.appspot.com",
  messagingSenderId: "691906502947",
  appId: "1:691906502947:web:0bb47e4d3781ec37cc6c96",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function GET() {
  const listRef = ref(storage, "/");
  const getResult = await listAll(listRef);
  getResult.items.forEach((itemRef) => {
    console.log(itemRef.fullPath);
  });
  return new NextResponse();
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const refName = ("video/" + formData.get("name")) as string;
  const video = formData.get("video") as File;
  const videoRef = ref(storage, refName);
  const uploadResult = await uploadBytes(videoRef, video);
  if (!uploadResult) {
    return new NextResponse("cannot upload file", {
      status: 500,
    });
  }
  return new NextResponse("ok");
}

export const config = {
  api: {
    responseLimit: "50mb",
  },
};
