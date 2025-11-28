import { NextResponse } from "next/server";
import { verifyCertificate } from "@/app/hashing/cryptoutils";

const GATEWAY = "https://gateway.pinata.cloud/ipfs";

export async function POST(req: Request) {
    try {
        const { cid, publicKeyBase64 } = await req.json();

        if (!cid || !publicKeyBase64) {
            return NextResponse.json(
                { error: "cid and publicKeyBase64 are required" },
                { status: 400 },
            );
        }

        // fetching from ipfs
        const ipfsRes = await fetch(`${GATEWAY}/${cid}`);
        if (!ipfsRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch from IPFS" },
                { status: 502 },
            );
        }

        const { issuingDetails, Signature } = await ipfsRes.json();

        // decoding public key
        const publicKeyJwk = JSON.parse(atob(publicKeyBase64));

        // verifying 
        const isValid = await verifyCertificate(
            issuingDetails,
            Signature,
            publicKeyJwk,
        );

        return NextResponse.json(
            { valid: isValid, details: issuingDetails },
            { status: 200 },
        );
    } catch (e) {
        console.error("Verify route error:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
