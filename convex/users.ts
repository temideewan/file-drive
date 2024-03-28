import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { QueryOrMutation } from "./files";
import { roles } from "./schema";

export async function getUser(ctx: QueryOrMutation, tokenIdentifier: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();
  if (!user) {
    throw new ConvexError("Expected a user to be available");
  }
  return user;
}
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      image: args.image,
    });
  },
});
export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await ctx.db.query('users').withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier)).first();
    if(!user){
      throw new ConvexError("No user with this token found");
    }
    await ctx.db.patch(user._id, {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      image: args.image,
    });
  },
});
export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});
export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    const org = user.orgIds.find((org) => org.orgId === args.orgId);
    if (!org) {
      throw new ConvexError("Expected an organization to be available");
    }
    org.role = args.role;

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users")},
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)
    return {
      name: user?.name,
      image: user?.image
    }
  }
})
