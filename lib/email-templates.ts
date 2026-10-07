const LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ';
const BRAND_COLOR = '#b38b22'; // Gold/Secondary color
const BG_COLOR = '#fff8e7'; // Cream background

const baseEmailStyles = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333333;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const headerStyles = `
  background-color: ${BG_COLOR};
  padding: 30px 20px;
  text-align: center;
  border-bottom: 3px solid ${BRAND_COLOR};
`;

const contentStyles = `
  padding: 40px 30px;
`;

const footerStyles = `
  background-color: #f4f4f4;
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #777777;
`;

const buttonStyles = `
  display: inline-block;
  background-color: ${BRAND_COLOR};
  color: #ffffff;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 20px;
`;

export const getWelcomeEmailHtml = (name: string) => `
<div style="${baseEmailStyles}">
  <div style="padding: 20px 0;">
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <img src="${LOGO_URL}" alt="Madhav Shringaar Logo" style="height: 60px; max-width: 100%; object-fit: contain;" />
      </div>
      <div style="${contentStyles}">
        <h1 style="color: ${BRAND_COLOR}; font-size: 24px; margin-bottom: 20px;">Welcome to Madhav Shringaar, ${name}! 🙏</h1>
        <p>Radhe Radhe!</p>
        <p>We are absolutely thrilled to welcome you to the Madhav Shringaar family. Thank you for choosing us for your divine devotion and shringaar needs.</p>
        <p>Our mission is to bring you the most exquisitely handcrafted Poshak, Mukut, and Seva Essentials for your beloved Laddu Gopal and other deities.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://madhavshringaar.com" style="${buttonStyles}">Explore Collections</a>
        </div>
        <p>If you have any questions or need assistance, simply reply to this email. We're always here to help.</p>
        <p>With devotion,<br/><strong>The Madhav Shringaar Team</strong></p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Madhav Shringaar. All rights reserved.</p>
        <p>Vrindavan, Mathura, UP, India</p>
      </div>
    </div>
  </div>
</div>
`;

export const getOtpEmailHtml = (otp: string) => `
<div style="${baseEmailStyles}">
  <div style="padding: 20px 0;">
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <img src="${LOGO_URL}" alt="Madhav Shringaar Logo" style="height: 60px; max-width: 100%; object-fit: contain;" />
      </div>
      <div style="${contentStyles}">
        <h1 style="color: ${BRAND_COLOR}; font-size: 24px; margin-bottom: 20px; text-align: center;">Your Verification Code</h1>
        <p style="text-align: center;">Please use the following OTP to verify your identity. This code will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: ${BG_COLOR}; border: 2px dashed ${BRAND_COLOR}; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 8px;">
            ${otp}
          </div>
        </div>
        <p style="text-align: center; font-size: 14px; color: #666;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Madhav Shringaar. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
`;

export const getOrderConfirmationHtml = (order: any) => `
<div style="${baseEmailStyles}">
  <div style="padding: 20px 0;">
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <img src="${LOGO_URL}" alt="Madhav Shringaar Logo" style="height: 60px; max-width: 100%; object-fit: contain;" />
      </div>
      <div style="${contentStyles}">
        <h1 style="color: ${BRAND_COLOR}; font-size: 24px; margin-bottom: 20px;">Order Confirmed! 🎉</h1>
        <p>Radhe Radhe! Thank you for your order. We have received it and will begin processing it right away.</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 6px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
          <p style="margin: 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: ${BRAND_COLOR};">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${order.orderitems.map((item: any) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong><br/>
                <span style="color: #666; font-size: 14px;">Qty: ${item.qty}</span>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
                ₹${Number(item.price).toFixed(2)}
              </td>
            </tr>
          `).join('')}
        </table>

        <div style="text-align: right; font-size: 16px;">
          <p><strong>Subtotal:</strong> ₹${Number(order.itemsPrice).toFixed(2)}</p>
          <p><strong>Shipping:</strong> ₹${Number(order.shippingPrice).toFixed(2)}</p>
          ${order.discountPrice > 0 ? `<p style="color: green;"><strong>Discount:</strong> -₹${Number(order.discountPrice).toFixed(2)}</p>` : ''}
          <h2 style="color: ${BRAND_COLOR}; margin-top: 15px;">Total: ₹${Number(order.totalPrice).toFixed(2)}</h2>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://madhavshringaar.com/track-order" style="${buttonStyles}">Track Your Order</a>
        </div>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Madhav Shringaar. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
`;

export const getAbandonedCartHtml = (items: any[], cartId: string) => `
<div style="${baseEmailStyles}">
  <div style="padding: 20px 0;">
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <img src="${LOGO_URL}" alt="Madhav Shringaar Logo" style="height: 60px; max-width: 100%; object-fit: contain;" />
      </div>
      <div style="${contentStyles}">
        <h1 style="color: ${BRAND_COLOR}; font-size: 24px; margin-bottom: 20px;">Did you forget something divine? ✨</h1>
        <p>Radhe Radhe! We noticed you left some beautiful items in your cart. Your Laddu Gopal's shringaar is waiting for you!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
          ${items.slice(0, 3).map((item: any) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong>
              </td>
            </tr>
          `).join('')}
          ${items.length > 3 ? `<tr><td colspan="2" style="text-align: center; padding: 10px; color: #666;">And ${items.length - 3} more items...</td></tr>` : ''}
        </table>

        <div style="background-color: ${BG_COLOR}; padding: 15px; border-left: 4px solid ${BRAND_COLOR}; border-radius: 4px; margin-bottom: 25px;">
          <p style="margin: 0; font-weight: bold; color: ${BRAND_COLOR};">Special Offer Just For You!</p>
          <p style="margin: 5px 0 0 0;">Use code <strong>DIVINE5</strong> at checkout to get 5% off your entire cart.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://madhavshringaar.com/cart" style="${buttonStyles}">Complete Your Purchase</a>
        </div>
      </div>
      <div style="${footerStyles}">
        <p>© ${new Date().getFullYear()} Madhav Shringaar. All rights reserved.</p>
        <p><a href="#" style="color: #999; text-decoration: underline;">Unsubscribe</a> from these reminders.</p>
      </div>
    </div>
  </div>
</div>
`;
