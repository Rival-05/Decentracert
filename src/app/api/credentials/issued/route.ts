import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Authorization token missing" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== "ISSUER" || !decoded.issuerId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Fetch issuer
        const issuer = await prisma.issuer.findUnique({
            where: { id: decoded.issuerId },
            select: {
                id: true,
                orgName: true,
                email: true,
                domain: true,
                status: true,
            },
        });

        if (!issuer) {
            return NextResponse.json(
                { success: false, message: "Issuer not found" },
                { status: 404 }
            );
        }

        // Fetch credentials issued by this issuer
        const credentials = await prisma.credential.findMany({
            where: { issuerId: issuer.id },
            orderBy: { issuedAt: "desc" },
            select: {
                id: true,
                credentialId: true,
                cid: true,
                type: true,
                title: true,
                status: true,
                issuedAt: true,
                expiresAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            issuer,
            credentials,
        });
    } catch (error) {
        console.error("Error fetching issued credentials:", error);

        // Handle database timeout errors
        if (error instanceof Error) {
            if (error.message.includes("timeout") || error.message.includes("SocketTimeout")) {
                return NextResponse.json(
                    { success: false, message: "Database connection timeout. Please try again." },
                    { status: 503 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            {
                status: 500,
            }
        );
    }
}
