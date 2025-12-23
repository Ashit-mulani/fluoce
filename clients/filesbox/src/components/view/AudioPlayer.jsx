"use client";

import React from "react";

export default function AudioPlayer({ url }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <audio
        src={url}
        controls
        preload="auto"
        className="w-full max-w-lg rounded"
        style={{ outline: "none" }}
      ></audio>
    </div>
  );
}
