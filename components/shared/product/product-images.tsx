'use client'
import { useState } from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";

const Productimages = (
    {images}: {images: string[]}
) => {
    const [current, setCurrent] = useState(0);
    return ( 
        <div className="space-y-4">
        <Image src={images[current]} alt="product image" width={1000} height={1000} className="min-h-[300px] object-cover object-center rounded-2xl shadow-sm border border-outline-variant/30" priority={true} />
        <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
                <div key={image} onClick={() => setCurrent(index)} className={cn("w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:border-secondary border-2 transition-all shadow-xs", index === current ? "border-secondary scale-105 shadow-md" : "border-outline-variant/30 opacity-70 hover:opacity-100")}>
                    <Image src={image} alt="product image" width={100} height={100} className="object-cover object-center w-full h-full" />
                </div>
            ))}
        </div>
        </div>
     );
}
 
export default Productimages;