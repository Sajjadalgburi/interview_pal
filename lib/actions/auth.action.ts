/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/firebase/admin";

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
