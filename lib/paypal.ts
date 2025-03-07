

const base = process.env.PAYPAL_API_URL || "https://api.sandbox.paypal.com";

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const access_token = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayPal API Error: ${errorText}`);
      }
    
      const jsonData = await response.json();
      return jsonData;
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PayPal API Error: ${errorText}`);
      }
    
      const jsonData = await response.json();
      return jsonData;
  },
};

// Generate PayPal access token
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
    throw new Error(
      "Missing PayPal credentials: PAYPAL_CLIENT_ID or PAYPAL_APP_SECRET"
    );
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials", // Fix: Ensure correct format
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal API Error: ${errorText}`);
  }

  const jsonData = await response.json();
  console.log("PayPal Access Token:", jsonData.access_token);
  return jsonData.access_token;
}

export { generateAccessToken };
