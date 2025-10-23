import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    console.log("Received certificate data:", body);

    return NextResponse.json({
        messageReceived: true
    });
}