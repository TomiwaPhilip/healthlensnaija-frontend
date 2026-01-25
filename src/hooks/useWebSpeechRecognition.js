// hooks/useWebSpeechRecognition.js
import { useState, useEffect, useRef } from 'react';

export function useWebSpeechRecognition({ lang = 'en-US', continuous = true, interimResults = true } = {}) {
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(text);
    };
    recognition.onerror = (err) => console.error('SpeechRecognition error:', err);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [continuous, interimResults, lang]);

  const start = () => {
    if (recognitionRef.current && supported) {
      recognitionRef.current.start();
      setListening(true);
    }
  };
  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { transcript, listening, supported, start, stop };
}
