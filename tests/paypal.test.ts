import { generateAccessToken, paypal } from '../lib/paypal';

describe('PayPal API integration tests', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'mock_paypal_client_id',
      PAYPAL_APP_SECRET: process.env.PAYPAL_APP_SECRET || 'mock_paypal_app_secret',
    };

    global.fetch = jest.fn().mockImplementation((url: unknown) => {
      const urlStr = String(url);
      if (urlStr.includes('/v1/oauth2/token')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ access_token: 'mock_access_token_xyz' }),
          text: async () => '',
        } as Response);
      }
      if (urlStr.includes('/v2/checkout/orders')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 'mock_order_100', status: 'CREATED' }),
          text: async () => '',
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ status: 'COMPLETED' }),
        text: async () => '',
      } as Response);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  // Test to generate access token from paypal
  test('generates token from paypal', async () => {
    const tokenResponse = await generateAccessToken();
    expect(typeof tokenResponse).toBe('string');
    expect(tokenResponse.length).toBeGreaterThan(0);
  });

  // Test to create a paypal order
  test('creates a paypal order', async () => {
    const price = 10.0;
    const orderResponse = await paypal.createOrder(price);

    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse).toHaveProperty('status');
    expect(orderResponse.status).toBe('CREATED');
  });

  // Test to capture payment with mock order
  test('simulate capturing a payment from an order', async () => {
    const orderId = '100';

    const mockCapturePayment = jest
      .spyOn(paypal, 'capturePayment')
      .mockResolvedValue({
        status: 'COMPLETED',
      });

    const captureResponse = await paypal.capturePayment(orderId);
    expect(captureResponse).toHaveProperty('status', 'COMPLETED');

    mockCapturePayment.mockRestore();
  });
});