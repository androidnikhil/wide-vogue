/**
 * Shiprocket API Client and Integration Service
 * Madhav Shringaar
 */

interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: string;
}

interface CreateOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: 'COD' | 'Prepaid';
  sub_total: number;
  length?: number;
  breadth?: number;
  height?: number;
  weight?: number;
}

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtain authenticated Bearer Token for Shiprocket
 */
export async function getShiprocketToken(): Promise<string> {
  // 1. Direct environment token if configured
  if (process.env.SHIPROCKET_TOKEN && !process.env.SHIPROCKET_EMAIL) {
    return process.env.SHIPROCKET_TOKEN;
  }

  // 2. Return cached token if still valid (valid for 9 days)
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL || process.env.EMAIL_USER || 'info@madhavshringaar.com';
  const password = process.env.SHIPROCKET_PASSWORD || process.env.SHIPROCKET_API_KEY;

  if (!password) {
    throw new Error('Shiprocket API credentials missing: SHIPROCKET_API_KEY is not defined.');
  }

  try {
    const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      // If direct password login fails but user passed token directly
      if (process.env.SHIPROCKET_TOKEN) {
        return process.env.SHIPROCKET_TOKEN;
      }
      throw new Error(data.message || `Failed to authenticate with Shiprocket (HTTP ${res.status}). Verify API User email: ${email}`);
    }

    cachedToken = data.token;
    // Cache for 9 days (token valid for 10 days = 240 hours)
    tokenExpiresAt = now + 9 * 24 * 60 * 60 * 1000;
    return cachedToken as string;
  } catch (error: any) {
    console.error('Shiprocket Authentication Error:', error.message);
    throw error;
  }
}

/**
 * Create an adhoc order in Shiprocket
 */
export async function createShiprocketAdhocOrder(orderData: CreateOrderPayload) {
  const token = await getShiprocketToken();

  const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || JSON.stringify(result.errors) || 'Failed to create order in Shiprocket');
  }

  return result;
}

/**
 * Generate AWB for a shipment
 */
export async function generateShiprocketAWB(shipmentId: number | string, courierId?: number) {
  const token = await getShiprocketToken();

  const body: any = { shipment_id: shipmentId };
  if (courierId) {
    body.courier_id = courierId;
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return result;
}

/**
 * Track shipment by AWB code
 */
export async function trackShiprocketShipmentByAWB(awbCode: string) {
  const token = await getShiprocketToken();

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${encodeURIComponent(awbCode)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  const result = await response.json();
  return result;
}

/**
 * Track shipment by Order ID
 */
export async function trackShiprocketShipmentByOrderId(orderId: string) {
  const token = await getShiprocketToken();

  const response = await fetch(`${SHIPROCKET_BASE_URL}/courier/track?order_id=${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return result;
}

/**
 * Check courier serviceability between pin codes
 */
export async function checkShiprocketServiceability(
  pickupPostcode: string,
  deliveryPostcode: string,
  cod: boolean = false,
  weight: number = 0.5
) {
  const token = await getShiprocketToken();

  const url = `${SHIPROCKET_BASE_URL}/courier/serviceability/?pickup_postcode=${encodeURIComponent(
    pickupPostcode
  )}&delivery_postcode=${encodeURIComponent(deliveryPostcode)}&cod=${cod ? 1 : 0}&weight=${weight}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return result;
}
