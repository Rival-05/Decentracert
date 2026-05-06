// Shared types for dashboards

export type IssuerStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CredentialStatus = "ACTIVE" | "REVOKED" | "EXPIRED" | "SUSPENDED";

export interface IssuerUser {
    id: string;
    orgName: string;
    email: string;
    domain: string;
    status: IssuerStatus;
    createdAt: string;
}

export interface StudentUser {
    id: string;
    name: string;
    email: string;
    enrollment: string;
    walletId: string;
    createdAt: string;
}

export interface IssuedCredential {
    id: string;
    credentialId: string;
    cid: string;
    type: string;
    title: string | null;
    status: string;
    issuedAt: string;
}

export interface HolderCredentialItem {
    id: string;
    credentialId: string;
    cid: string;
    type: string;
    title: string | null;
    status: CredentialStatus;
    issuedAt: string;
    expiresAt: string | null;
    issuer: {
        id: string;
        orgName: string;
        domain: string;
    };
}

export interface IssueForm {
    walletId: string;
    type: string;
    title: string;
    program: string;
    department: string;
    cgpa: string;
    graduationYear: string;
    expiresAt: string;
    additionalRemarks: string;
}

export interface MeResponse {
    success: boolean;
    role?: "ISSUER" | "STUDENT";
    user?: IssuerUser;
    message?: string;
}

export interface IssueResponse {
    success: boolean;
    message?: string;
    credential?: IssuedCredential;
}

export interface IssueCredentialsResponse {
    success: boolean;
    credentials?: IssuedCredential[];
    message?: string;
}

export interface MineResponse {
    success: boolean;
    student?: StudentUser;
    credentials?: HolderCredentialItem[];
    message?: string;
}
