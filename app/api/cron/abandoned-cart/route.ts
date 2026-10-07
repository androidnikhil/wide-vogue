import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { sendEmail } from '@/lib/nodemailer';
import { getAbandonedCartHtml } from '@/lib/email-templates';

export async function GET(req: NextRequest) {
  // Optional: Check auth header to ensure only a CRON service (like Vercel Cron) can trigger this
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Find carts that haven't been updated in 24 hours, have items, and belong to a user
    const abandonedCarts = await prisma.cart.findMany({
      where: {
        updatedAt: { lte: yesterday },
        userId: { not: null },
      },
      include: {
        user: true,
      }
    });

    let emailsSent = 0;

    for (const cart of abandonedCarts) {
      if (cart.items && (cart.items as any[]).length > 0 && cart.user?.email) {
        
        // Ensure they haven't already ordered these items recently
        // (A simple check would be to see if they have any recent orders)
        const recentOrder = await prisma.order.findFirst({
          where: {
            userId: cart.userId,
            createdAt: { gte: yesterday }
          }
        });

        if (!recentOrder) {
          const html = getAbandonedCartHtml(cart.items as any[], cart.id);
          await sendEmail(
            cart.user.email,
            "You left something beautiful behind! ✨",
            html
          );
          emailsSent++;
          
          // Note: In a production app, you might want to flag this cart as "reminder sent" 
          // so you don't email them every day. For now, this serves as the initial implementation.
        }
      }
    }

    return NextResponse.json({ success: true, processed: abandonedCarts.length, emailsSent });
  } catch (error) {
    console.error('CRON Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process abandoned carts' }, { status: 500 });
  }
}
