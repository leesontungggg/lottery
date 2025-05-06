/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";

export default function Home() {
  const [winner, setWinner] = useState<any>([0]);
  const [winnerName, setWinnerName] = useState<any>("");
  const [winnerOrigin, setWinnerOrigin] = useState<any>("");
  const [numberList, setNumberList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [originList, setOriginList] = useState([]);
  const [showVisible, setShowVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000); // 10000 milliseconds = 10 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showVisible]);

  useEffect(() => {
    fetch("/api/get-list", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          setNumberList(data.listNumberData);
          setNameList(data.listNameData);
          setOriginList(data.listOriginData);
        }
      });
  }, []);

  useEffect(() => {
    if (winner) {
      setShowVisible(true);
    }
  }, [winner]);

  useEffect(() => {
    const keyDownHandler = (e: any) => {
      if (e.code == "Enter") {
        setShowVisible(false);
        setIsVisible(false);
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

        const winningIndex = numberList.findIndex(
          (item) => item === tempwinner[0]
        );

        setWinnerName(nameList[winningIndex]);
        setWinnerOrigin(originList[winningIndex]);

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
  }, [nameList, numberList, originList]);

  if (numberList.length)
    return (
      <div className="grid grid-cols-1 gap-2 w-full px-2">
        <div className="flex flex-col items-center justify-center w-full h-full">
          {isVisible && (
            <div className=" text-black p-4 rounded-md flex justify-center text-2xl">
              {winnerName} <br />
              {winnerOrigin}
            </div>
          )}
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
      </div>
    );
}
