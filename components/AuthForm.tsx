"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Form stuff and schema
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type == "sign-up" ? z.string().nonempty() : z.string().optional(),
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Means user is registering for the first time
      if (type === "sign-up") {
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
        console.log("sign up", values);
      } else {
        // Means user is signing in /logging
        toast.success("Signed In successfully!");
        router.push("/");

        console.log("sign in", values);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn: boolean = type == "sign-in";

  return (
    <div className="card-border lg:max-w-[556px]">
      {" "}
      <div className="card flex flex-col gap-6 px-10 py-14">
        <div className="flex flex-row justify-center gap-2">
          <Image src="/logo.svg" alt="logo" width={32} height={38} />
          <h2 className="text-primary-100">Interview Pal</h2>
        </div>
        <h3 className={""}>Practice interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form mt-4 w-full space-y-6"
          >
            {!isSignIn && (
              <FormField
                name="name"
                control={form.control}
                label="Name"
                placeholder="Your name"
              />
            )}{" "}
            <FormField
              name="email"
              control={form.control}
              label="Email"
              type="email"
              placeholder="Your email address"
            />
            <FormField
              name="password"
              control={form.control}
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Sign In" : "Create An Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="text-user-primary ml-1 font-bold"
          >
            {" "}
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
