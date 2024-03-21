import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";
export type QueryOrMutation = QueryCtx | MutationCtx;

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be logged in to upload a file");
  }
  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(
  ctx: QueryOrMutation,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier);
  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
  if (!hasAccess) {
    throw new ConvexError("You do not have access to this organisation");
  }

  return hasAccess;
}
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to upload a file");
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("You do not have access to this organization");
    }
    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    isFavorites: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }
    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    const query = args.query;
    if (query) {
      files =  files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    } 

    if(args.isFavorites){
      const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();
      if(!user) return files;
      const favorites = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", q => q.eq("userId", user?._id).eq("orgId", args.orgId)).collect();
      files = files.filter((file) => favorites.some((f) => f.fileId === file._id))
    }

    return files
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files"), storageId: v.id("_storage") },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);
   if(!access) {
    throw new ConvexError("No access to file ");
   }
    await ctx.db.delete(args.fileId);
    await ctx.storage.delete(args.storageId);
  },
});

export const toggleFavorite = mutation({
  args: { fileId: v.id("files"), storageId: v.id("_storage") },
  async handler(ctx, args) {
   const access = await hasAccessToFile(ctx, args.fileId);
   if(!access) {
    throw new ConvexError("No access to file ");
   }
   const {user, file} = access;
    const favorite = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", q => q.eq("userId", user._id).eq("orgId", file.orgId).eq("fileId", file._id)).first();
    if(!favorite){
      await ctx.db.insert("favorites", {
        fileId: file._id,
        orgId: file.orgId,
        userId: user._id,
      })
    } else {
      await ctx.db.delete(favorite._id)
    }
  },
});

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">){
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  const file = await ctx.db.get(fileId);

  if (!file) return null;
  const hasAccess = await hasAccessToOrg(
    ctx,
    identity.tokenIdentifier,
    file.orgId
  );
  if (!hasAccess) {
    return null;
  }
  
  const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).first();
  if(!user) return null;

  return {user, file}
}
