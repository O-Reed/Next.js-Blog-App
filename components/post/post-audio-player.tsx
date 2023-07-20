"use client";

import { HeadphonesIcon } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface PostAudioPlayerProps {
  audio: string;
}

const PostAudioPlayer: React.FC<PostAudioPlayerProps> = ({ audio }) => {
  return (
    <>
      <div className="relative mt-10 mb-5 flex p-5 items-center justify-center gap-6 rounded-xl border border-black/5 sm:flex-row">
        <div className="text-normal absolute left-2.5 top-0 -translate-y-1/2 bg-white px-2 font-normal text-slate-500">
          <div className="inline-flex">
            <HeadphonesIcon className="h-6 w-6 mr-2 text-gray-400" />
            <span className="text-gray-400 tracking-tight [word-spacing:-5px] text-md">
              Нийтлэлийг сонсох
            </span>
          </div>
        </div>

        <ReactPlayer
          height="50px"
          width="100%"
          url={audio}
          controls={true}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default PostAudioPlayer;
