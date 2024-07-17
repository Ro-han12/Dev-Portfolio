"use client"
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Admin from "./admin/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route=useRouter();
  useEffect(()=>{
      route.replace('/admin')
  },[])
  return (
    <div>
      
    </div>

  );
}
