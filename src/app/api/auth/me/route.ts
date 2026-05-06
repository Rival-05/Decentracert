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

        if (!decoded) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // If logged-in user is an issuer
        if (decoded.role === "ISSUER" && decoded.issuerId) {
            const issuer = await prisma.issuer.findUnique({
                where: { id: decoded.issuerId },
                select: {
                    id: true,
                    orgName: true,
                    email: true,
                    domain: true,
                    status: true,
                    createdAt: true,
                },
            });

            if (!issuer) {
                return NextResponse.json(
                    { success: false, message: "Issuer not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                role: "ISSUER",
                user: issuer,
            });
        }

        // If logged-in user is a student
        if (decoded.role === "STUDENT" && decoded.studentId) {
            const student = await prisma.student.findUnique({
                where: { id: decoded.studentId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    enrollment: true,
                    walletId: true,
                    createdAt: true,
                },
            });

            if (!student) {
                return NextResponse.json(
                    { success: false, message: "Student not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                role: "STUDENT",
                user: student,
            });
        }

        return NextResponse.json(
            { success: false, message: "Invalid token payload" },
            { status: 400 }
        );
    } catch (error) {
        console.error("/api/auth/me error:", error);

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
            { status: 500 }
        );
    }
}