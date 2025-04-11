import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await isAuthenticated();
  if (!user) redirect("/sign-in");

  return (
    <>
      <section className="card-cta">
        <div className="flex max-w-lg flex-col gap-6">
          <h2>Be Interview-Ready with AI-Powered Mock Interviews</h2>
          <p>
            Practice interviewing with our AI-powered platform. Get real-time
            feedback and improve your skills.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src={"/robot.png"}
          alt="robot-image"
          width={400}
          height={400}
          className="max-sm:hidden"
        />{" "}
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {/* <p>You have not taken any interviews yet!</p> */}
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}{" "}
        </div>
      </section>
    </>
  );
};

export default Page;
