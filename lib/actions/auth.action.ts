/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ONE_WEEK = 60 * 60 * 24 * 7;
type serverMessage = {
  success: boolean;
  message: string;
};

/**
 * Method to sign up a new user. Logic mostly saves the user
 * into the database if they do not exist.
 */
export const signUp = async (params: SignUpParams): Promise<serverMessage> => {
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
 * Method which will sign a user in if they exist in the database.
 * This method will also create a session cookie for the user.
 * @param params
 * @returns
 */
export const signIn = async (
  params: SignInParams,
): Promise<serverMessage | undefined> => {
  const { idToken, email } = params;

  try {
    const user = await auth.getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }

    await setSessionCookie(idToken);
  } catch (e) {
    console.log(e);

    return {
      success: false,
      message: "Failed to login...",
    };
  }
};

/**
 * This method will essentially create a session cookie for the user.
 * This is used to authenticate the user in the backend.
 * @param idToken
 */
export const setSessionCookie = async (idToken: string): Promise<void> => {
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

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log("Error getting user", error);
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();

  return !!user;
};

export const logout = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) return;

    cookieStore.delete("session");

    redirect("/sign-in");
  } catch (error) {
    console.log("Error logging out", error);
    return;
  }
};
