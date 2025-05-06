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
      }, 11000); // 10000 milliseconds = 10 seconds

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
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/50 transition-opacity" aria-hidden="true"></div>
          
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-blue-300/70 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-base font-semibold text-white" id="modal-title">Thông tin trúng thưởng</h3>
                        <div className="mt-2">
                          <p className="text-white text-4xl">{winnerName}</p>
                          <p className="text-white text-2xl">{winnerOrigin}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
