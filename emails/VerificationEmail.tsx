import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Body,
  Img,
  Hr,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your EchoInbox Account</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your EchoInbox verification code: {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Branding */}
          <Section style={header}>
            <Row>
              <Text style={logo}>EchoInbox</Text>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Row>
              <Heading as="h2" style={heading}>
                Welcome, {username}!
              </Heading>
            </Row>

            <Row>
              <Text style={text}>
                Thank you for signing up for EchoInbox. To complete your registration
                and verify your account, please use the verification code below:
              </Text>
            </Row>

            {/* OTP Code Display */}
            <Row>
              <Section style={otpContainer}>
                <Text style={otpCode}>{otp}</Text>
              </Section>
            </Row>

            <Row>
              <Text style={text}>
                This code will expire in <strong>10 minutes</strong> for security reasons.
              </Text>
            </Row>

            <Row>
              <Text style={text}>
                If you didn&apos;t create an account with EchoInbox, please disregard
                this email. Your security is important to us.
              </Text>
            </Row>

            {/* Optional Verify Button */}
            <Row style={buttonContainer}>
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://echoinbox.com'}/verify/${username}`}
                style={button}
              >
                Verify Account
              </Button>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Row>
              <Text style={footerText}>
                <strong>EchoInbox</strong> - Anonymous Feedback Platform
              </Text>
            </Row>
            <Row>
              <Text style={footerText}>
                This is an automated message, please do not reply to this email.
              </Text>
            </Row>
            <Row>
              <Text style={footerText}>
                Need help? Contact us at support@echoinbox.com
              </Text>
            </Row>
            <Row>
              <Text style={footerTextSmall}>
                © {new Date().getFullYear()} EchoInbox. All rights reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Roboto, Verdana, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 40px',
  backgroundColor: '#6366f1',
  textAlign: 'center' as const,
};

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
  letterSpacing: '-0.5px',
};

const content = {
  padding: '40px 40px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 20px',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '16px 0',
};

const otpContainer = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 0',
  textAlign: 'center' as const,
  border: '2px dashed #6366f1',
};

const otpCode = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#6366f1',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  display: 'inline-block',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '20px 40px',
};

const footer = {
  padding: '0 40px 40px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerTextSmall = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#9ca3af',
  margin: '16px 0 0',
  textAlign: 'center' as const,
};