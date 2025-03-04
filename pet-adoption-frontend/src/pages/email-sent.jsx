import React from "react";
import { useRouter } from "next/router";
import EmailSentComponent from "@/components/verification-email-sent/EmailSentComponent";

export default function EmailSent() {
    const router = useRouter();
    const { email } = router.query; // Get email from the URL query

    return email ? <EmailSentComponent email={email} /> : <p>Loading...</p>;
}
