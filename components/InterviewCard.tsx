import { formatDate, normalizeType } from "@/helpers";
import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = normalizeType(type);
  const formattedDate = formatDate(
    feedback?.createdAt || createdAt || new Date(),
  );

  return (
    <div className="card-border min-h-96 w-[360px] max-sm:w-full">
      <div className="card-interview">
        <div>
          <div className="bg-light-600 absolute top-0 right-0 w-fit rounded-bl-lg px-4 py-2">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover-image-for-company"
            width={90}
            height={90}
            className="size-[90px] rounded-full object-cover"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="mt-3 flex flex-row gap-5">
            <div className="flex flex-row gap-2">
              <Image
                src={"calendar.svg"}
                alt="calendar"
                height={22}
                width={22}
              />
              <p className="text-light-200 text-sm">{formattedDate}</p>
            </div>

            <div className="flex flex-row items-center gap-2">
              {" "}
              <Image src={"/star.svg"} alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="mt-5 line-clamp-2">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet! Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "View Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
