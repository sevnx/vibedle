import { Azeret_Mono, Epilogue, Newsreader } from "next/font/google";

export const gameEpilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

export const gameMono = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const gameNewsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400"],
  display: "swap",
});
