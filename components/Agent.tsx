import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

enum CallStatusEnum {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps) => {
  const isSpeaking: boolean = true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const callStatus = CallStatusEnum.FINISHED;
  const messages = ["awdawd", "adawdwad", "awdwad", "last"];

  const lastMessage = messages[messages.length - 1];

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
              key={lastMessage}
              className={cn(
                "opacity-0 transition-opacity duration-500",
                "animate-fadeIn opacity-100",
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}
      {/* <div className="flex w-full justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="btn-call relative">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden",
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div> */}
    </>
  );
};

export default Agent;
