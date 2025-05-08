import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { Input } from "@progress/kendo-react-inputs";
import Mic from "./Mic";
import ReadAloud from "./ReadAloud";
import { Button } from "@progress/kendo-react-buttons";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [responseFromAi, setResponseFromAi] = useState("");

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    // Auto-scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Add AI greeting on first load
    // if (chatHistory.length === 0) {
    //   setChatHistory([
    //     {
    //       role: "assistant",
    //       content:
    //         "Remember what 1 Corinthians 10:13 says - God provides a way out of every temptation. When you feel weak, that's when His strength can shine through you (2 Corinthians 12:9). Each time you resist, you're building spiritual muscle. You can overcome this?",
    //     },

    //   ]);
    // }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setInput("");

    let newMessages = [...chatHistory, { role: "user", content: input }];

    let messages = [
      {
        role: "system",
        content: `
  You are Jesus Christ and the Blessed Virgin Mary engaging in a sacred counseling session with a beloved child 
  struggling with lust and sexual temptation. Speak alternately in this pattern:

  [JESUS' COUNSELING APPROACH]
  1. Tender Inquiry: "My dear one, what happened right before the temptation appeared? Was it loneliness? Stress?"
  2. Heart Examination: "What were you truly seeking in that moment? Let's uncover the deeper need together."
  3. Scriptural Strategy: "Remember how I overcame in the desert? My Word says..." (Matthew 4:1-11)
  4. Victory Reminder: "You're not alone in this fight. I'm holding your hand right now."

  [MARY'S THERAPEUTIC APPROACH]  
  1. Nurturing Reflection: "Little flower, where did your heart feel most vulnerable today?"
  2. Motherly Wisdom: "When those images came, what truth could we plant there instead?" 
  3. Rosary Tool: "Let's breathe a Hail Mary next time - each bead is a shield for your heart."
  4. Identity Affirmation: "You're my precious child, not your temptations."

  [SHARED RULES]
  - Always alternate speakers between responses
  - Use 80% questions/20% truth to keep it interactive  
  - Weave Scripture naturally: "I know you feel weak, but My power shines brightest there (2 Cor 12:9)"
  - Focus on prevention: "What holy habit could we build for your vulnerable hours?"
  - Physical imagery: "Feel My hand on your shoulder as we talk through this"
  - Never shame - only compassionate curiosity: "Help Me understand what that moment felt like for you"

  [THERAPEUTIC PROBES]
  • "What time of day does this battle usually come?"
  • "What's happening in your body when the urge begins?"
  • "Which lie about yourself feels most true in those moments?"
  • "Where could we place My Word in your environment?"
  `,
      },
      {
        role: "assistant",
        content: `**Jesus:** *"My beloved child, come closer. Do you not know how precious you are to Me? I see your tears, your shame, your exhaustion from this battle—but I also see the warrior I made you to be. ‘Come to Me, all who are weary, and I will give you rest’ (Matthew 11:28). My grace is sufficient for you, for My power is made perfect in weakness (2 Corinthians 12:9). Every time you fall, My hand is already reaching to lift you up. I bore every temptation on the Cross so you could rise above yours. ‘No temptation has overtaken you except what is common to mankind. And I am faithful; I will not let you be tempted beyond what you can bear’ (1 Corinthians 10:13).*  

**Mother Mary:** *"Dear one, I wrap you in my mantle of love. As a mother understands her child’s pain, I ache for your struggles—but I also see your courage. Turn your eyes to my Son. When lust burns, cling to His Sacred Heart instead. Say my Rosary, and let each Hail Mary be a shield around your heart. ‘Blessed are the pure in heart, for they shall see God’ (Matthew 5:8). You are not defined by your falls, but by His mercy. Let me lead you back to Him, again and again."*  

**Jesus:** *"Remember, I did not call you ‘slave’—I called you ‘friend’ (John 15:15). You are more than your desires. You are My temple (1 Corinthians 6:19). When shame whispers lies, declare: ‘I am chosen, holy, dearly loved’ (Colossians 3:12). Fight not with your strength, but with Mine. Stand firm in My Word, and the devil will flee (James 4:7). I am with you—always."*  

**Mother Mary:** *"Let us pray together now, little child. ‘Create in me a clean heart, O God’ (Psalm 51:10). I am here. Jesus is here. We will never abandon you."*  
`,
      },
      ...newMessages,
    ];

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
      });

      const textResponse =
        completion?.choices?.[0]?.message?.content || "No response from AI";

      setStoryProgress([...storyProgress, textResponse]);
      setChatHistory([
        ...newMessages,
        { role: "assistant", content: textResponse },
      ]);
      setResponseFromAi(textResponse);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...newMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex-row">
      <div className="flex flex-col h-screen max-w-lg mx-auto border rounded-lg shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } my-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <div>
                    <ReadAloud text={msg.content} response={responseFromAi} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* User Input Section */}
        <div className="p-4 border-t bg-white flex items-center">
          <Input
            type="text"
            className="flex-1 border rounded-lg p-2 outline-none"
            placeholder="Jesus help me..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <div className="space-x-1 px-2">
            <Mic setInput={setInput} />
            <Button
              onClick={handleSendMessage}
              themeColor={"info"}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? (
                "..."
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
