// Dashboard-specific constants and configurations

export const CREDENTIAL_TYPES = [
    "Degree",
    "Transcript",
    "Course Completion",
    "Internship Certificate",
    "Merit Certificate",
    "Diploma",
] as const;

export const ISSUER_STATUS_TONE = {
    APPROVED: "bg-brand/20 text-neutral-700",
    REJECTED: "bg-destructive/10 text-destructive",
    PENDING: "bg-secondary text-secondary-foreground",
} as const;

export const HOLDER_CREDENTIAL_STATUS = {
    ACTIVE: "bg-green-200 text-green-800",
    REVOKED: "bg-red-200 text-red-800",
    EXPIRED: "bg-secondary text-secondary-foreground",
    SUSPENDED: "bg-muted text-muted-foreground",
} as const;

export const TOAST_MESSAGES = {
    CREDENTIAL_ISSUED_SUCCESS: "Credential issued successfully",
    CREDENTIAL_ISSUED_FAIL: "Unable to issue credential",
    CID_COPIED: "CID copied",
    CID_COPY_FAILED: "Could not copy CID",
    ISSUER_PROFILE_LOAD_FAIL: "Could not load issuer profile",
    DB_TIMEOUT: "Database temporarily unavailable. Please try again.",
    REQUEST_FAILED: "Request failed. Please try again",
    FILL_REQUIRED_FIELDS: "Fill all mandatory fields",
    HOLDER_CREDS_LOAD_FAIL: "Unable to load your credentials.",
    HOLDER_CREDS_FETCH_FAIL: "Request failed. Please try again.",
} as const;

export const FORM_LABELS = {
    WALLET_ID: "Wallet ID",
    CREDENTIAL_TYPE: "Credential Type",
    TITLE: "Title",
    PROGRAM: "Program",
    DEPARTMENT: "Department",
    CGPA: "CGPA",
    GRADUATION_YEAR: "Graduation Year",
    EXPIRES_AT: "Expires At (optional)",
    ADDITIONAL_REMARKS: "Additional Remarks (Optional)",
} as const;

export const FORM_PLACEHOLDERS = {
    WALLET_ID: "Holder wallet ID",
    TITLE: "B.Tech Computer Science",
    PROGRAM: "B.Tech",
    DEPARTMENT: "Computer Science",
    CGPA: "8.74",
    GRADUATION_YEAR: "2026",
    CREDENTIAL_TYPE: "Search type...",
    ADDITIONAL_REMARKS: "Any additional context or note",
} as const;

export const FORM_FIELDS = [
    {
        key: "walletId",
        label: FORM_LABELS.WALLET_ID,
        placeholder: FORM_PLACEHOLDERS.WALLET_ID,
    },
    {
        key: "title",
        label: FORM_LABELS.TITLE,
        placeholder: FORM_PLACEHOLDERS.TITLE,
    },
    {
        key: "program",
        label: FORM_LABELS.PROGRAM,
        placeholder: FORM_PLACEHOLDERS.PROGRAM,
    },
    {
        key: "department",
        label: FORM_LABELS.DEPARTMENT,
        placeholder: FORM_PLACEHOLDERS.DEPARTMENT,
    },
    {
        key: "cgpa",
        label: FORM_LABELS.CGPA,
        placeholder: FORM_PLACEHOLDERS.CGPA,
    },
    {
        key: "graduationYear",
        label: FORM_LABELS.GRADUATION_YEAR,
        placeholder: FORM_PLACEHOLDERS.GRADUATION_YEAR,
    },
] as const;
