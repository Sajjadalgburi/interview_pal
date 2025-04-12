import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user.id),
    await getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews: boolean = userInterviews?.length > 0;
  const hasUpcomingInterviews: boolean = latestInterviews?.length > 0;

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
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="md:text-md text-sm">
              You have not taken any interviews yet!
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-6">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p className="md:text-md text-sm">
              You have not taken any interviews yet!
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
