/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * Method to sign up a new user. Logic mostly saves the user into the database if they do not exist.
 */
export const signUp = async (params: SignUpParams) => {
  const { uid, name, email } = params;

  try {
    const user = await db.collection("users").doc(uid).get();

    if (user.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    } else {
      await db.collection("users").doc(uid).set({
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: "User created successfully",
      };
    }
  } catch (e: any) {
    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Faild To Sign Up",
    };
  }
};

/**
 * This method will essentially create a session cookie for the user. This is used to authenticate the user in the backend.
 * @param idToken
 */
export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    sameSite: "lax",
  });
};
