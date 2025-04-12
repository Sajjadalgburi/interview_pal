"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatusEnum {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const Agent = ({ userName, userId }: AgentProps) => {
  const router = useRouter();

  // Application state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatusEnum>(
    CallStatusEnum.INACTIVE,
  );
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const latestMessage = messages[messages.length - 1]?.content;

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatusEnum.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatusEnum.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        // Update the state with the new message
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const onSpeakStart = () => setIsSpeaking(true);
    const onSpeakEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.log("Error:", error.message);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeakStart);
    vapi.on("speech-end", onSpeakEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeakStart);
      vapi.off("speech-end", onSpeakEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (callStatus === CallStatusEnum.FINISHED) router.push("/");

    return () => {};
  }, [messages, callStatus, userId, router]);

  const handleCall = async (): Promise<void> => {
    setCallStatus(CallStatusEnum.CONNECTING);

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        userid: userId,
        username: userName,
      },
    });
  };
  const handleDisconnect = async (): Promise<void> => {
    setCallStatus(CallStatusEnum.FINISHED);

    vapi.stop();
  };

  const isCallInactiveOrFinished: boolean =
    callStatus === CallStatusEnum.INACTIVE ||
    callStatus === CallStatusEnum.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src={"/ai-avatar.png"}
              alt="Vapi AI Agent"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src={"/ai-avatar.png"}
              alt="User Avatar"
              width={540}
              height={540}
              className="size-[120px] rounded-full object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
            <h3>{userName}</h3>
          </div>
        </div>
      </div>{" "}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              className={cn(
                "opacity-0 transition-opacity duration-500",
                "animate-fadeIn opacity-100",
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="flex w-full justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="btn-call relative" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden",
              )}
            />

            <span className="relative">
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn-disconnect">
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
