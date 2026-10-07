import CartTable from "./cart-table"; 
import { getMyCart } from "@/lib/actions/cart.action";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export const metadata = {
    title: 'Shopping Cart'
}

const CartPage = async () => {
    const cart = await getMyCart();
    const session = await auth();
    let availablePoints = 0;
    
    if (session?.user?.id) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { bhaktiPoints: true }
        });
        if (user) availablePoints = user.bhaktiPoints;
    }

    return ( 
        <CartTable cart={cart} availablePoints={availablePoints} />
     );
}
 
export default CartPage;