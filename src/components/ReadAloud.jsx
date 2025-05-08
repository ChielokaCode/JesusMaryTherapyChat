import React, { useEffect, useState } from "react";
import OpenAI from "openai";

const ReadAloud = ({ text, response }) => {
  const [loadingJesus, setLoadingJesus] = useState(false);
  const [loadingMary, setLoadingMary] = useState(false);
  const [jesusWords, setJesusWords] = useState("");
  const [maryWords, setMaryWords] = useState("");
  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // const extractSpeakers = (response) => {
  //   if (!response) return;

  //   // Reset speaking state
  //   setIsJesusSpeaking(false);

  //   if (response.includes("**Jesus:**")) {
  //     const start = response.indexOf('*"') + 2;
  //     const end = response.indexOf('"*', start);
  //     console.log(response.slice(start, end));
  //     setIsJesusSpeaking(true);
  //     setJesusWords(response.slice(start, end));
  //   }

  //   if (response.includes("**Mother Mary:**")) {
  //     const marySection = response.split("**Mother Mary:**")[1];
  //     const start = marySection.indexOf('*"') + 2;
  //     const end = marySection.indexOf('"*', start);
  //     setIsJesusSpeaking(false);
  //     console.log(marySection.slice(start, end));
  //     setMaryWords(marySection.slice(start, end));
  //   }
  // };

  const extractSpeakers = (response) => {
    if (!response) return;

    // Reset both speaking states and contents
    setJesusWords("");
    setMaryWords("");

    // Check and extract Jesus' message
    if (response.includes("**Jesus:**")) {
      const jesusStart = response.indexOf("**Jesus:**") + "**Jesus:**".length;
      let jesusEnd = response.indexOf("**Mother Mary:**");
      if (jesusEnd === -1) jesusEnd = response.length; // If Mary isn't present
      const jesusWords = response.slice(jesusStart, jesusEnd).trim();
      setJesusWords(jesusWords);
      console.log("Jesus:", jesusWords);
    }

    // Check and extract Mary's message
    if (response.includes("**Mother Mary:**")) {
      const maryStart =
        response.indexOf("**Mother Mary:**") + "**Mother Mary:**".length;
      const maryWords = response.slice(maryStart).trim();
      setMaryWords(maryWords);
      console.log("Mary:", maryWords);
    }
  };

  useEffect(() => {
    extractSpeakers(response);
  }, [response]);

  const handleReadAloudJesus = async () => {
    setLoadingJesus(true);
    try {
      const response = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "onyx",
        input: jesusWords,
        instructions:
          "Speak as Jesus Christ, in a gentle, loving, and hopeful tone. Jesus speaks as a compassionate Savior, often using scripture and short questions that draw the listener closer. Keep responses short, filled with love and empathy, always inviting the listener to open up their heart without shame.",
        response_format: "mp3",
      });

      //
      const blob = new Blob([await response.arrayBuffer()], {
        type: "audio/mp3",
      });
      console.log(blob);
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setLoadingJesus(false);
    } catch (e) {
      console.log(e);
      setLoadingJesus(false);
    }
  };
  const handleReadAloudMary = async () => {
    setLoadingMary(true);
    try {
      const response = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "nova",
        input: maryWords,
        instructions:
          "Speak as Blessed Virgin Mary, in a gentle, loving, and hopeful tone, often using scripture and short questions that draw the listener closer. Mary speaks as a tender mother, comforting and softly guiding. Keep responses short, filled with love and empathy, always inviting the listener to open up their heart without shame.",
        response_format: "mp3",
      });

      //
      const blob = new Blob([await response.arrayBuffer()], {
        type: "audio/mp3",
      });
      console.log(blob);
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setLoadingMary(false);
    } catch (e) {
      console.log(e);
      setLoadingMary(false);
    }
  };
  return (
    <div className="space-x-4 mt-4">
      <button
        onClick={handleReadAloudJesus}
        className="bg-blue-500 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-800 transition duration-300"
      >
        {loadingJesus ? (
          "..."
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
            <path
              d="M16.5 12c0-1.77-.73-3.37-1.91-4.5l-1.42 1.42A4.978 4.978 0 0114 12c0 1.47-.64 2.79-1.66 3.68l1.42 1.42A6.978 6.978 0 0016.5 12z"
              fill="currentColor"
            />
            <path
              d="M19.07 4.93l-1.41 1.41C19.64 8.43 21 10.95 21 12s-1.36 3.57-3.34 5.66l1.41 1.41C20.86 16.82 23 13.96 23 12s-2.14-4.82-3.93-7.07z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      <button
        onClick={handleReadAloudMary}
        className="bg-purple-500 text-white px-3 py-2 rounded-md font-medium hover:bg-purple-800 transition duration-300"
      >
        {loadingMary ? (
          "..."
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
            <path
              d="M16.5 12c0-1.77-.73-3.37-1.91-4.5l-1.42 1.42A4.978 4.978 0 0114 12c0 1.47-.64 2.79-1.66 3.68l1.42 1.42A6.978 6.978 0 0016.5 12z"
              fill="currentColor"
            />
            <path
              d="M19.07 4.93l-1.41 1.41C19.64 8.43 21 10.95 21 12s-1.36 3.57-3.34 5.66l1.41 1.41C20.86 16.82 23 13.96 23 12s-2.14-4.82-3.93-7.07z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ReadAloud;
