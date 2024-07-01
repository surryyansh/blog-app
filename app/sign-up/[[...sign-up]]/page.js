"use client"
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <>
      <div className="container">
        <Image
          src="/pexels-pixabay-267569.jpg"
          layout="fill"
          objectFit="cover"
          className="backgroundImage"
        />
        <div className="signUpWrapper">
          <SignUp />
        </div>
      </div>
      <style jsx>{`
        .container {
          position: relative;
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .backgroundImage {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .signUpWrapper {
          background-color: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
