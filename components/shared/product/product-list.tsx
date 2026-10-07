import { Product } from "@/types";
import ProductCard from "./product-card";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="text-3xl font-extrabold text-[#ca6d6f] flex-center md:before:content-[''] md:before:border-[#e0e0e0] md:before:border-b-2 md:before:flex-1 md:after:flex-1 md:after:content-[''] md:after:border-[#e0e0e0] md:after:border-t-2 uppercase gap-4">
        {title}
      </h2>
      <p className="font-[18px] flex-center mb-4">Go With The Trend </p>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
