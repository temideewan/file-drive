"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {getConfiguration} from "../config";

const { convexUrl, clerkPublishableKey} = getConfiguration();

const convex = new ConvexReactClient(convexUrl!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ClerkProvider publishableKey={clerkPublishableKey}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>

}
