import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
  expiryMinutes?: number;
}

export default function OtpEmail({ otp, expiryMinutes = 10 }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Kode OTP reset password Anda: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Kode Verifikasi</Heading>
          <Text style={paragraph}>
            Gunakan kode berikut untuk mereset password akun LSP UIN SGD Anda:
          </Text>
          <Section style={otpBox}>
            <Text style={otpText}>{otp}</Text>
          </Section>
          <Text style={paragraph}>
            Kode ini berlaku selama {expiryMinutes} menit. Jangan bagikan kode
            ini ke siapa pun, termasuk pihak yang mengaku dari LSP.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 32px",
  borderRadius: "8px",
  maxWidth: "480px",
};
const heading = { fontSize: "20px", fontWeight: "bold", color: "#1a1a1a" };
const paragraph = { fontSize: "14px", lineHeight: "22px", color: "#3c3c3c" };
const otpBox = {
  textAlign: "center" as const,
  margin: "24px 0",
  padding: "16px",
  backgroundColor: "#f0f7ff",
  borderRadius: "8px",
};
const otpText = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  color: "#008BE3",
  margin: 0,
};
