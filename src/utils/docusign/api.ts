/**
 * DocuSign Integration Utility
 * 
 * Expected Environment Variables (added to .env.local):
 * DOCUSIGN_CLIENT_ID
 * DOCUSIGN_USER_ID
 * DOCUSIGN_RSA_KEY
 */

export async function getDocuSignAccessToken() {
  const clientId = process.env.DOCUSIGN_CLIENT_ID
  const userId = process.env.DOCUSIGN_USER_ID
  const rsaKey = process.env.DOCUSIGN_RSA_KEY

  if (!clientId || !userId || !rsaKey) {
    console.warn("DocuSign credentials missing. Please configure them in .env.local")
    return null
  }

  // TODO: Implement actual JWT grant auth fetching via official `docusign-esign` Node.js SDK
  
  return "MOCK_TOKEN_UNTIL_CONFIGURED"
}

export async function createEmbeddedSignatureRequest({
  bookingId,
  customerInfo,
  templateId
}: {
  bookingId: string;
  customerInfo: { name: string; email: string };
  templateId: string;
}) {
  const token = await getDocuSignAccessToken()
  if (!token) throw new Error("DocuSign auth failed - keys missing")

  // Placeholder logic: This function would construct an envelope using the `templateId`,
  // then make a secondary request for a recipient view URL (embedded signing iframe URL).
  
  return `https://demo.docusign.net/Member/EmailStart.aspx?a=mock_token_for_booking_${bookingId}`
}
