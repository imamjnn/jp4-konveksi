import { NextResponse } from "next/server";

export function successResponse<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  );
}

export function errorResponse(error: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}
