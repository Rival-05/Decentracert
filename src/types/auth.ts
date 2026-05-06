/**
 * Authentication and authorization related types
 * Centralized types for auth components and pages
 */

/**
 * User role in the system
 * - "holder": Student/credential holder
 * - "issuer": Institution/organization issuing credentials
 */
export type Role = "holder" | "issuer";

/**
 * User verification result from the verify page
 */
export type VerifyResult = {
    success: boolean;
    found?: boolean;
    summary?: {
        trustworthy: boolean;
        message: string;
    };
    credential?: {
        credentialId: string;
        cid: string;
        type: string;
        title: string | null;
        issuedAt: string;
        expiresAt: string | null;
        status: string;
    };
    issuer?: {
        orgName: string;
        domain: string;
        approved: boolean;
    };
    holder?: {
        name: string;
        enrollment: string;
        walletId: string;
    };
    academic?: {
        program?: string | null;
        department?: string | null;
        cgpa?: string | null;
        graduationYear?: string | null;
    } | null;
    message?: string;
};

/**
 * Props for verified details card component
 */
export type VerifiedDetailsCardProps = {
    credentialData: VerifyResult;
    lookupLabel: string;
    lookupTone: string;
};
