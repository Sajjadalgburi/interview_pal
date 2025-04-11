"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

// AUTH STUFF
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";

// Form stuff and schema
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Means user is registering for the first time
      if (type === "sign-up") {
        const { name, email, password } = values;

        // first we would like to authenticate the user before creating a user
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        // Means user is signing in /logging
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken: string = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error("Failed to sign in");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed In successfully!");
        router.push("/");
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
