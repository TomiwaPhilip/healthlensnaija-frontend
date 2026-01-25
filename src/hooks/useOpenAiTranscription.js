// hooks/useOpenAiTranscription.js
import { useState, useRef } from "react";
import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

let encoderRegistered = false;
async function safeRegisterEncoder() {
  if (!encoderRegistered) {
    await register(await connect());
    encoderRegistered = true;
  }
}

export function useOpenAiTranscription() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    await safeRegisterEncoder();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    audioChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/wav" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav"); // filename matters

      try {
        const API_URL = import.meta.env.VITE_API_URL;
             const res = await fetch(`${API_URL}/transcribe`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setTranscript(data.transcript || "");
      } catch (err) {
        console.error("❌ Upload/transcription failed:", err);
      } finally {
        // release mic
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return { recording, transcript, startRecording, stopRecording };
}
