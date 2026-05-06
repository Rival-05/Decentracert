// Status and badge utilities

import type { IssuerStatus, CredentialStatus } from "@/types/dashboard";
import { ISSUER_STATUS_TONE, HOLDER_CREDENTIAL_STATUS } from "@/lib/constants/dashboard";

export function getIssuerStatusTone(status: IssuerStatus | undefined | null): string {
    if (!status) return ISSUER_STATUS_TONE.PENDING;
    return ISSUER_STATUS_TONE[status];
}

export function getHolderCredentialStatusClass(status: CredentialStatus): string {
    return HOLDER_CREDENTIAL_STATUS[status] || HOLDER_CREDENTIAL_STATUS.SUSPENDED;
}
