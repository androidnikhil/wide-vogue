import { cn } from "@/lib/utils";

const ProductPrice = ({value, className}: {value: number | string; className?: string}) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format to Indian currency style
    const formattedValue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numericValue);

    return ( 
        <span className={cn("font-bold tracking-tight", className)}>
            {formattedValue}
        </span>
     );
}
 
export default ProductPrice;