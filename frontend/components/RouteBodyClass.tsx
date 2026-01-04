 "use client";
 
 import { useEffect } from "react";
 import { usePathname } from "next/navigation";
 
 export default function RouteBodyClass() {
   const pathname = usePathname();
 
   useEffect(() => {
     const shouldDisable = pathname === "/login" || pathname === "/signup";
     document.body.classList.toggle("no-bg", !!shouldDisable);
   }, [pathname]);
 
   return null;
 }
