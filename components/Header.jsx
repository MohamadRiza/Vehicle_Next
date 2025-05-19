import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react";
import { CheckUser } from "@/lib/CheckUser";

const Header = async ({ isAdminPage = false }) => {
  const user = await CheckUser();

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b ">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdmin ? "/admin" : "/"} className="flex">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          {isAdminPage && (
            <span className="text-xs font-extralight">admin</span>
          )}
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
             <Link href="/">
             <Button variant="outline" className="flex items-center gap-2">
               <ArrowLeft size={18} />
               <span>Back to App</span>
             </Button>
           </Link>
          ) : (
            <SignedIn>
              <Link href="/saved-cars">
                <Button>
                  <Heart size={18} />

                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>

              {!isAdmin ? (
                <Link href="/reservations">
                  <Button variant="outline">
                    <CarFront size={18} />

                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline">
                    <Layout size={18} />

                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            <SignInButton forceRedirectUrl="/">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}/>
          </SignedIn>
          
        </div>
      </nav>
    </header>
  );
};

export default Header;
