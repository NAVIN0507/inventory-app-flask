"use client";

import { useEffect } from "react";

export default function BackendWarmup() {
  useEffect(() => {
    async function warmUp() {
      try {
        await fetch("https://inventory-app-flask.onrender.com/ping", {
          cache: "no-store",
        });
        console.log(" Backend warmed up");
      } catch (err) {
        console.log("Backend waking up...");
      }
    }

    warmUp();
  }, []);

  return null; 
}
