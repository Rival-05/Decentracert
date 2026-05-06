import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";

const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function generateCredentialId() {
    return `cert-${Date.now()}`;
}

function stableStringify(obj: JsonValue): string {
    if (obj === null || typeof obj !== "object") {
        return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
        return "[" + obj.map(stableStringify).join(",") + "]";
    }
    return (
        "{" + Object.keys(obj).sort().map((key) => JSON.stringify(key) + ":" + stableStringify(obj[key])).join(",") + "}"
    );
}

export async function POST(req: NextRequest) {
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

        // Check issuer
        const issuer = await prisma.issuer.findUnique({
            where: { id: decoded.issuerId },
        });

        if (!issuer) {
            return NextResponse.json(
                { success: false, message: "Issuer not found" },
                { status: 404 }
            );
        }

        if (issuer.status !== "APPROVED") {
            return NextResponse.json(
                { success: false, message: "Issuer is not approved" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const {
            walletId,
            type,
            title,
            program,
            department,
            cgpa,
            graduationYear,
            expiresAt,
            additionalRemarks,
        } = body;

        if (!walletId || !type || !title || !program || !department || !cgpa || !graduationYear) {
            return NextResponse.json(
                { success: false, message: "walletId, type, title, program, department, cgpa, and graduationYear are required" },
                { status: 400 }
            );
        }

        // Find student
        const student = await prisma.student.findUnique({
            where: { walletId },
        });

        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found for this walletId" },
                { status: 404 }
            );
        }

        const credentialId = generateCredentialId();

        const credentialJson = {
            credentialId,
            type,
            title,
            issuedAt: new Date().toISOString(),
            issuer: {
                orgName: issuer.orgName,
                domain: issuer.domain,
            },
            holder: {
                name: student.name,
                enrollment: student.enrollment,
            },
            academic: {
                program,
                department,
                cgpa,
                graduationYear,
            },
            remarks: additionalRemarks ?? null,
        };

        const canonical = stableStringify(
            credentialJson
        );

        const payloadHash = crypto
            .createHash("sha256")
            .update(canonical)
            .digest("hex");


        // Upload to Pinata
        const pinataRes = await fetch(PINATA_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: JSON.stringify({
                pinataContent: credentialJson,
                pinataMetadata: {
                    name: `${student.enrollment}-${type}-credential`,
                },
            }),
        });

        if (!pinataRes.ok) {
            const text = await pinataRes.text();
            console.error("Pinata upload error:", text);

            return NextResponse.json(
                { success: false, message: "Failed to upload credential to IPFS" },
                { status: 500 }
            );
        }

        const pinataJson = await pinataRes.json();
        const cid = pinataJson.IpfsHash;

        // Store metadata in DB
        const credential = await prisma.credential.create({
            data: {
                credentialId,
                cid,
                payloadHash,
                type,
                title,
                issuerId: issuer.id,
                studentId: student.id,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        await prisma.auditLog.create({
            data: {
                action: "CREDENTIAL_ISSUED",
                role: "ISSUER",
                actorIssuerId: issuer.id,
                metadata: {
                    credentialId,
                    cid,
                    studentId: student.id,
                    walletId: student.walletId,
                    type,
                    title,
                    program,
                    department,
                    cgpa,
                    graduationYear,
                    additionalRemarks: additionalRemarks ?? null,
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Credential issued successfully",
                credential: {
                    id: credential.id,
                    credentialId: credential.credentialId,
                    cid: credential.cid,
                    type: credential.type,
                    title: credential.title,
                    status: credential.status,
                    issuedAt: credential.issuedAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Credential issuance error:", error);

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