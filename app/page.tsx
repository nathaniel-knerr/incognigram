"use client";
import PostCard from "@/components/PostCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/post"


export default function Home() {

  const [posts, setPosts] = useState<Array<Post>>([]);


  async function getPosts() {
    const allPostsRequest = await supabase.from("posts")
      .select()
      .order("created_at", { ascending: false });
    const allPosts = allPostsRequest.data;

    if (allPosts) {
      setPosts(allPosts);
    } else {
      console.error("Error: Posts data not found.");
    }

  }


  useEffect(() => {
    getPosts();
  }, []);


  return (
    <>
      <main className="flex-1 flex flex-col items-center bg-gray-900">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </main>
    </>
  );
}
