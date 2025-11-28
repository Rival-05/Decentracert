import { NextResponse } from "next/server";

const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("Received certificate data:", body);

        const pinataRes = await fetch(PINATA_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: JSON.stringify({
                pinataContent: body,
                pinataMetadata: { name: "decentracert-certificate" },
            }),
        });

        if (!pinataRes.ok) {
            const text = await pinataRes.text();
            console.error("Pinata error:", text);
            return NextResponse.json(
                { error: "Failed to upload to IPFS" },
                { status: 500 },
            );
        }

        const resJson = await pinataRes.json();
        const cid = resJson.IpfsHash;

        return NextResponse.json({ success: true, cid }, { status: 200 });
    } catch (e) {
        console.error("Issue route error:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
