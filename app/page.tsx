"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

export default function Home() {

  const [clickedAt, SetClickedAt] = useState({ id: "", atY: null, atX: null });

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("hello", (receivedMsg: any) => {
      // console.log("receivedMsg: ", receivedMsg)
      setElements(receivedMsg)
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

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
    // const y = event.pageY - event.target.offsetTop
    console.log(event.target.offsetLeft)
    SetClickedAt({ id: event.target.id, atY: pageY, atX: pageX })
  };

  const handleMouseMove = (event: any) => {
    const { clientX, clientY, pageX, pageY, target } = event;
    // console.log(clientX, clientY, pageX, pageY, target)

    const boxes = elements.map((el) => {
      return { x: el.x, width: el.width, track: el.track }
    })

    function boxCollision(boxA: { x: number, width: number, track: number }, boxB: { x: number, width: number, track: number }) {
      if (boxA.track === boxB.track && (
        boxA.x + boxA.width >= boxB.x &&
        boxA.x <= boxB.x + boxB.width
      )) {
        return true
      }
      return false
    }

    const tmpElements = elements.map((el) => {
      if (el.id == clickedAt.id) {
        if (clickedAt.atY != null) {
          const trackDist = 100

          console.log(clickedAt.atY, clientY, clientY - clickedAt.atY)

          if (clickedAt.atY > trackDist * 2) { /// starts at track 3
            if (clientY - clickedAt.atY < trackDist * -1) {
              el.track = 1
            } else if (clientY - clickedAt.atY < 0) {
              el.track = 2
            } else if (clientY - clickedAt.atY < trackDist) {
              el.track = 3
            }
          } else if (clickedAt.atY > trackDist * 1) { /// starts at track 2
            if (clientY - clickedAt.atY > trackDist) {
              el.track = 3
            } else if (clientY - clickedAt.atY < 0) {
              el.track = 1
            } else if (clientY - clickedAt.atY < trackDist) {
              el.track = 2
            }
          } else if (clickedAt.atY < trackDist) { /// starts at track 1
            if (clientY - clickedAt.atY > trackDist * 2) {
              el.track = 3
            } else if (clientY - clickedAt.atY > trackDist) {
              el.track = 2
            } else if (clientY - clickedAt.atY < trackDist) {
              el.track = 1
            }
          }


        }

        /// collision check
        console.log(boxes)
        if (
          false
          // boxes.some((box: any) => {
          //   return boxCollision({ x: clientX - el.width / 2, width: el.width, track: el.track }, box)
          // })
        ) {
          // do nothing
        } else {
          el.x = Number(clientX) - el.width / 2
          socket.emit("hello", elements);
        }

        return el
      } else {
        return el
      }
    });

    setElements(tmpElements)
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    SetClickedAt({ id: "", atY: null, atX: null })
    console.log("emitting")
  };


  return (
    <main className="">

      <div>
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>


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
