"use client";

import { initials } from "./ProfileContext";
import { useAvatarSrc } from "./avatarStore";

type AvatarProps = {
  name: string;
  className?: string; // size, jaise "w-[34px] h-[34px]"
  textClass?: string; // naam ke harfon ka size/font
};

// Photo ho to photo, warna naam ke pehle harf (jaisa pehle tha)
export default function Avatar({ name, className = "", textClass = "" }: AvatarProps) {
  const src = useAvatarSrc();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${name}'s photo`}
        className={`${className} rounded-full object-cover flex-none`}
      />
    );
  }

  return (
    <span
      className={`${className} ${textClass} rounded-full bg-[linear-gradient(135deg,#F7C9B4,#CFE9C8)] grid place-items-center font-semibold flex-none`}
      style={{ color: "#1D2A22" }}
    >
      {initials(name)}
    </span>
  );
}