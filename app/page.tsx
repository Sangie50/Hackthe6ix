"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // const myRef: any = useRef(null);

  // useEffect(() => {
  //   myRef.current.addEventListener('click', handleClick);
  //   return () => {
  //     myRef.current.removeEventListener('click', handleClick);
  //   };
  // }, []);

  // const handleClick = (event: any) => {
  //   console.log('Clicked!');
  // };

  const [clickedAt, SetClickedAt] = useState({ id: "", at: null });

  const [elements, setElements] = useState([
    { id: "a", width: 70, x: 100, track: 1, color: "bg-blue-700" },
    { id: "b", width: 90, x: 200, track: 1, color: "bg-red-700" },
    { id: "c", width: 80, x: 400, track: 1, color: "bg-green-700" },
    { id: "d", width: 70, x: 100, track: 2, color: "bg-blue-700" },
    { id: "e", width: 90, x: 200, track: 2, color: "bg-red-700" },
    { id: "f", width: 80, x: 400, track: 2, color: "bg-green-700" },
    { id: "g", width: 70, x: 100, track: 3, color: "bg-blue-700" },
    { id: "h", width: 90, x: 200, track: 3, color: "bg-red-700" },
    { id: "i", width: 80, x: 400, track: 3, color: "bg-green-700" },
  ]);

  const handleMouseDown = (event: any) => {
    const { clientX, clientY, pageX, pageY } = event;
    // console.log(clientX, clientY, pageX, pageY)
    event.preventDefault()
    SetClickedAt({ id: event.target.id, at: event.pageY })
  };

  const handleMouseMove = (event: any) => {
    const { clientX, clientY, pageX, pageY, target } = event;


    // console.log(clientX, clientY, pageX, pageY, target)
    if (clickedAt.at != null) {
      console.log(clickedAt.at, clientY, clientY - clickedAt.at, clickedAt.at - clientY)

    }


    const tmp = elements.map((el) => {
      if (el.id == clickedAt.id) {
        if (clickedAt.at != null && (clickedAt.at - clientY > 112)) {
          if (el.track > 1) {
            el.track = el.track - 1
          }
        }
        if (clickedAt.at != null && (clickedAt.at - clientY < 112)) {
          if (el.track < 3) {
            el.track = el.track + 1
          }
        }
        el.x = clientX
        return el
      } else {
        return el
      }
    });

    setElements(tmp)

  };

  const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    SetClickedAt({ id: "", at: null })
  };



  return (
    <main className="">


      <div onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>

        <div className="track1 w-full bg-white h-28 relative">
          {elements
            .filter((el) => el.track == 1)
            .map((el) => {
              return (
                <div
                  onMouseDown={handleMouseDown}
                  key={el.id}
                  id={`${el.id}`}
                  style={{ height: `100px`, width: `${el.width}px`, left: `${el.x}px` }}
                  className={`${el.color} absolute`}
                > hi </div>
              );
            })}
        </div>
        <hr />
        <div className="track1 w-full bg-white h-28 relative">
          {elements
            .filter((el) => el.track == 2)
            .map((el) => {
              return (
                <div
                  onMouseDown={handleMouseDown}
                  key={el.id}
                  id={`${el.id}`}
                  style={{ height: `100px`, width: `${el.width}px`, left: `${el.x}px` }}
                  className={`${el.color} absolute`}
                > hi </div>
              );
            })}
        </div>
        <hr />
        <div className="track1 w-full bg-white h-28 relative">
          {elements
            .filter((el) => el.track == 3)
            .map((el) => {
              return (
                <div
                  onMouseDown={handleMouseDown}
                  key={el.id}
                  id={`${el.id}`}
                  style={{ height: `100px`, width: `${el.width}px`, left: `${el.x}px` }}
                  className={`${el.color} absolute`}
                > hi </div>
              );
            })}
        </div>

      </div>


    </main>
  );
}
