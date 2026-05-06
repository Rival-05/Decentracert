export const APP_ROUTES = {
    verify: "/verify",
} as const;

export const topNavActions = [
    {
        href: APP_ROUTES.verify,
        ariaLabel: "Open credential verification",
        label: {
            mobile: "Verify",
            desktop: "Verify",
        },
    },
] as const;

export function buildVerifyHref(cid: string) {
    return `${APP_ROUTES.verify}?cid=${encodeURIComponent(cid)}`;
}