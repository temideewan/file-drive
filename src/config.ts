export function getConfiguration(){
  let clerkSecretKey = process.env.CLERK_SECRET_KEY;
  let clerkHostName = process.env.CLERK_HOSTNAME;
  let clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  let convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if(process.env.NODE_ENV === 'production'){
    clerkSecretKey = process.env.CLERK_SECRET_KEY_PROD;
    clerkHostName = process.env.CLERK_HOSTNAME_PROD;
    clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_PROD;
    convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL_PROD;
  }

  return {
    clerkSecretKey,
    clerkHostName,
    convexUrl,
    clerkPublishableKey,
  }
}
