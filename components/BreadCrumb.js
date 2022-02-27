import { useRouter } from "next/router"
import CustomLink from "./CustomLink";

const BreadCrumb = () => { 
    const routes = useRouter().asPath.split('?').shift().split("/");
    
    return (
      <div className="flex gap-2 items-center capitalize flex-wrap font-semibold max-w-max text-sm ">
        <CustomLink text="home" />
        {routes.map((route, i) =>
          i === routes.length - 1 ? (
            <span key={i}>{route}</span>
          ) : (
            <CustomLink href={`${routes.slice(0, i + 1).join("/")}`} key={i} className="transition hover:underline">
              {route} {i !== routes.length - 1 && "/"}
            </CustomLink>
          )
        )}
      </div>
    );
}
 
export default BreadCrumb
