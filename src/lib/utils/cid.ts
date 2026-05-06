// CID (Content Identifier) utilities

const CID_VISIBLE_LENGTH = 12;

export function getMaskedCid(cid: string): string {
    return cid.length <= CID_VISIBLE_LENGTH ? cid : `${cid.slice(0, CID_VISIBLE_LENGTH)}...`;
}

export async function copyCidToClipboard(cid: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(cid);
        return true;
    } catch {
        return false;
    }
}
