import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import DisplayTechIcons from "../../../../components/DisplayTechIcons";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview || !user) redirect("/");

  console.log(interview);

  return (
    <>
      <div className="flex flex-row justify-between gap-5">
        <div className="flex flex-row items-center gap-5 max-sm:flex-col">
          <div className="flex flex-row items-center gap-5">
            <Image
              src={getRandomInterviewCover()}
              alt="Cover Image"
              width={40}
              height={40}
              className="size-[40px] rounded-full object-cover"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-300 h-fit rounded-lg px-4 py-2 capitalize">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user.name}
        questions={interview.questions}
        type={user.id}
        interviewId={id}
      />
    </>
  );
};

export default Page;
