import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

const Header = () => {
    return <header className="w-full border-b sticky top-0 bg-white z-10">
        <div className="wrapper flex-between">
            <div className="flex-start">
                <CategoryDrawer />
                <Link href="/" className="flex-start ml-4">
                        <Image src="/images/logo.svg" alt={`${APP_NAME} logo`} width={200} height={60} priority={true} />
                </Link>
            </div>
            <div className="hidden md:block">
                <Search />
            </div>
                <Menu />
        </div>
    </header>;
}
 
export default Header;