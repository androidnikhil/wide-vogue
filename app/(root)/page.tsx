import ProductList from "@/components/shared/product/product-list";
import { Button } from "@/components/ui/button";
import { getLatestproduct } from "@/lib/actions/product.action";

const Home = async() => {
  const latestProducts = await getLatestproduct();
  return (
   <>
   <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
   <Button className="text-center">Homepage</Button>
   </>
  );
};

export default Home;
