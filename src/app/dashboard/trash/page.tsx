'use client'
import { useQuery } from "convex/react";
import { FileBrowser } from "../_components/file-browser";
import { api } from "../../../../convex/_generated/api";

export default function FavoritePage(){  
  return <div>
    <FileBrowser title="Favorites" isDeleted />
  </div>
}
