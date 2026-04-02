import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // To delete a cookie in Next.js, we set it with an expiration date in the past
    cookieStore.set("mio_auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Set to Jan 1, 1970
    });

    return NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed" }, 
      { status: 500 }
    );
  }
}