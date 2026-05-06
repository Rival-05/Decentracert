import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function stableStringify(obj: JsonValue): string {
    if (obj === null || typeof obj !== "object") {
        return JSON.stringify(obj);
    }

    if (Array.isArray(obj)) {
        return "[" + obj.map(stableStringify).join(",") + "]";
    }

    return (
        "{" +
        Object.keys(obj)
            .sort()
            .map(
                (key) =>
                    JSON.stringify(key) + ":" + stableStringify(obj[key])
            )
            .join(",") +
        "}"
    );
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ cid: string }> }
) {
    try {
        const { cid } = await params;

        if (!cid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "CID is required",
                },
                { status: 400 }
            );
        }

        // 1. Registry Lookup
        const credential = await prisma.credential.findUnique({
            where: { cid },
            include: {
                issuer: true,
                student: true,
            },
        });

        if (!credential) {
            return NextResponse.json(
                {
                    success: false,
                    found: false,
                    message: "Credential not found in registry",
                },
                { status: 404 }
            );
        }

        // 2. Fetch IPFS Content
        let ipfsAvailable = false;
        let ipfsPayload: JsonValue | null = null;
        let integrityPassed = false;

        try {
            const ipfsRes = await fetch(
                `https://gateway.pinata.cloud/ipfs/${cid}`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (ipfsRes.ok) {
                ipfsPayload = await ipfsRes.json();
                ipfsAvailable = true;

                const canonical =
                    stableStringify(ipfsPayload);

                const currentHash = crypto
                    .createHash("sha256")
                    .update(canonical)
                    .digest("hex");

                integrityPassed =
                    currentHash === credential.payloadHash;
            }
        } catch (error) {
            console.error("IPFS fetch error:", error);
        }

        // 3. Lifecycle Checks
        const now = new Date();

        const revoked =
            credential.status === "REVOKED";

        const suspended =
            credential.status === "SUSPENDED";

        const expired =
            credential.expiresAt !== null &&
            credential.expiresAt < now;

        const active =
            !revoked &&
            !suspended &&
            !expired;

        // 4. Trust Summary
        const trustworthy =
            ipfsAvailable &&
            integrityPassed &&
            credential.issuer.status === "APPROVED" &&
            active;

        return NextResponse.json({
            success: true,
            found: true,

            summary: {
                trustworthy,
                message: trustworthy
                    ? "Authentic academic record found"
                    : "Record found with issues",
            },

            credential: {
                credentialId: credential.credentialId,
                cid: credential.cid,
                type: credential.type,
                title: credential.title,
                issuedAt: credential.issuedAt,
                expiresAt: credential.expiresAt,
                status: credential.status,
            },

            issuer: {
                orgName: credential.issuer.orgName,
                domain: credential.issuer.domain,
                approved:
                    credential.issuer.status === "APPROVED",
            },

            holder: {
                name: credential.student.name,
                enrollment: credential.student.enrollment,
                walletId: credential.student.walletId,
            },

            checks: {
                existsInRegistry: true,
                existsOnIPFS: ipfsAvailable,
                integrityPassed,
                issuerApproved:
                    credential.issuer.status === "APPROVED",
                revoked,
                suspended,
                expired,
                active,
            },

            academic:
                ipfsPayload &&
                    typeof ipfsPayload === "object" &&
                    !Array.isArray(ipfsPayload)
                    ? ((ipfsPayload as { academic?: JsonValue }).academic ?? null)
                    : null,

            ipfsPayload,
        });
    } catch (error) {
        console.error("Verification error:", error);

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
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}