import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// import { DeepgramClient } from "@deepgram/sdk";

export function Interview() {
  const { interviewid } = useParams();
  const audiorRef = useRef<HTMLAudioElement>(null);
  //   const client = new DeepgramClient();
  console.log(interviewid);
  useEffect(() => {
    (async () => {
      const pc = new RTCPeerConnection();
      console.log(pc)
      audiorRef.current = document.createElement("audio");
      audiorRef.current.autoplay = true;
      pc.ontrack = (e) => (audiorRef.current!.srcObject = e.streams[0]!);

      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        "token",
        "d3d80fcd1ec06034631d5890be15282096d83025",
      ]);       
      console.log(socket)
      socket.onopen = () => {
        const mediaRecorder = new MediaRecorder(ms, { mimeType: "audio/webm" });
        mediaRecorder.start(250);

        mediaRecorder.addEventListener("dataavailable", (event) => {
          socket.send(event.data);
        });
      };

      socket.onmessage = (message) => {
        const recived = JSON.parse(message.data);
        const transcript = recived.channel.alternatives[0].transcript;
        if (transcript) {
          axios.post(`${BACKEND_URL}/api/v1/session/user/response/${interviewid}`, {
                        message: transcript,
                    });
        }
      };
    })()
  }, [interviewid]);

  return <div>Interview</div>;
}
