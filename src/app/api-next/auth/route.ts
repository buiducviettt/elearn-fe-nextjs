import environmentHandler from "@/utils/environmentHandler";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, expiredAt } = body;
  const cookieStore = await cookies();

  if (!Boolean(token && expiredAt)) {
    return Response.json(
      { message: "Không nhận được token hoặc expiredAt" },
      {
        status: 400,
      },
    );
  }

  cookieStore.set("token", token, {
    httpOnly: true,
    expires: new Date(expiredAt), // milliseconds
    sameSite: "lax",
    path: "/",
    secure: environmentHandler.isProduction,
  });

  return Response.json({ message: "Đã lưu token" }, { status: 200 });
}
