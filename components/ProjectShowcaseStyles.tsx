"use client";

import { useEffect } from "react";

export default function ProjectShowcaseStyles() {
  useEffect(() => {
    // Apply full-screen styles
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.width = "100vw";
    document.documentElement.style.height = "100vh";
    document.documentElement.style.position = "fixed";

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";

    const main = document.querySelector("main");
    if (main) {
      (main as HTMLElement).style.margin = "0";
      (main as HTMLElement).style.padding = "0";
      (main as HTMLElement).style.width = "100vw";
      (main as HTMLElement).style.height = "100vh";
    }

    const nextRoot = document.getElementById("__next");
    if (nextRoot) {
      nextRoot.style.margin = "0";
      nextRoot.style.padding = "0";
      nextRoot.style.width = "100vw";
      nextRoot.style.height = "100vh";
    }

    // Cleanup function
    return () => {
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
      document.documentElement.style.position = "";

      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.position = "";

      if (main) {
        (main as HTMLElement).style.margin = "";
        (main as HTMLElement).style.padding = "";
        (main as HTMLElement).style.width = "";
        (main as HTMLElement).style.height = "";
      }

      if (nextRoot) {
        nextRoot.style.margin = "";
        nextRoot.style.padding = "";
        nextRoot.style.width = "";
        nextRoot.style.height = "";
      }
    };
  }, []);

  return null;
}


