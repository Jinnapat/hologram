"use client";

import StorageZone from "./playlist/StorageZone";
import PlaylistZone from "./playlist/PlaylistZone";

export default function PlaylistTab() {
  return (
    <div className="w-full flex flex-col gap-5">
      <StorageZone />
      <PlaylistZone />
    </div>
  );
}
