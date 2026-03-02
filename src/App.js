import { useEffect, useRef, useState } from "react";
import Avatar2D from "./Avatar2D";

function App() {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const botSpeakingRef = useRef(false);

  useEffect(() => {
    createRecognition();
  }, []);

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta SpeechRecognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setListening(true);
      console.log("🎤 Escuchando...");
    };
    recognition.onresult = async (event) => {
      if (botSpeakingRef.current) return;
      const texto = event.results[0][0].transcript.trim();
      if (!texto) return;
      console.log("Usuario:", texto);
      await processConversation(texto);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        console.log("Error:", event.error);
      }
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;
    startListening();
  };

  const startListening = () => {
    if (botSpeakingRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {}
  };

  const processConversation = async (text) => {
    try {
      const res = await fetch("https://demobackend-wnz9.onrender.com/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onplay = () => {
        botSpeakingRef.current = true;
        setSpeaking(true);
      };
      audio.onended = () => {
        setSpeaking(false);
        botSpeakingRef.current = false;
        setTimeout(() => {
          startListening();
        }, 500);
      };

      await audio.play();

    } catch (error) {
      console.error("Error:", error);
      botSpeakingRef.current = false;
      setSpeaking(false);
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>Avatar IA Demo</h2>

      <p>
        Estado:{" "}
        {speaking
          ? "🗣️ IA hablando"
          : listening
          ? "🎤 Escuchando"
          : "⏸️ Esperando"}
      </p>

      <Avatar2D speaking={speaking} />
    </div>
  );
}

export default App;