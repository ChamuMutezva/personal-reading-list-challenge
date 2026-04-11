import "server-only";
import { StackServerApp } from "@stackframe/stack";
//import { stackClientApp } from "./client";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: '/signin',
    afterSignIn: "/library",
    afterSignUp: "/library",
    afterSignOut: "/",
  },
});
