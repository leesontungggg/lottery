/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import NumberList from "@/public/dot3.json";
import { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";

export default function Home() {
  const [winner, setWinner] = useState<any>([0]);
  const [numberList, setNumberList] = useState([]);

  useEffect(() => {
    fetch("/api/get-list", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          setNumberList(data.data);
        }
      });
  }, []);

  useEffect(() => {
    const keyDownHandler = (e: any) => {
      if (e.code == "Enter") {
        const storage = window.localStorage.getItem("winner");

        let currentWinner = storage
          ? JSON.parse(window.localStorage.getItem("winner") || "")
          : null;

        const tempwinner = numberList
          .filter((item) =>
            currentWinner ? !currentWinner.includes(item) : true
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 1);

        setWinner(tempwinner);

        if (storage) {
          currentWinner = [...currentWinner, ...tempwinner];

          window.localStorage.setItem("winner", JSON.stringify(currentWinner));
        } else {
          window.localStorage.setItem("winner", JSON.stringify(tempwinner));
        }
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [numberList]);

  if (numberList.length)
    return (
      <div className="grid grid-cols-1 gap-2 w-full px-2">
        <div className="bg-white aspect-square w-full max-w-[400px] border-8 border-[#C09C61] flex justify-center items-center text-8xl mx-auto">
          <SlotCounter
            startValue={"000"}
            startValueOnce
            value={String(winner[0]).padStart(3, "0")}
            animateUnchanged
            direction="bottom-up"
            autoAnimationStart={false}
            duration={10}
          />
        </div>
      </div>
    );
}
