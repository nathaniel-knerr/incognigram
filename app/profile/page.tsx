"use client";
import PostCard from "@/components/PostCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Post } from "@/types/post";


export default function Profile() {

  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [postContent, setPostContent] = useState("");


  async function getUserPosts() {
    const userRequest = await supabase.auth.getUser();
    const user: User | null = userRequest.data.user;

    if (user) {
        const postsRequest = await supabase.from("posts")
            .select()
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
            
        const posts = postsRequest.data;
            if (posts) {
            setUserPosts(posts);
        } else {
            console.error("Error: Posts data not found.");
        }
    } else {
        console.error("Error: Not logged into a user.");
    }
  }


  async function makePost(postContent: string) {
    const userRequest = await supabase.auth.getUser();
    const user: User | null = userRequest.data.user;
    
    if (user) {

        await supabase.from("posts").insert({
            user_id: user.id,
            content: postContent,
        });

        console.log("Post Made:");
        console.log(postContent);
        console.log("By " + user.id);

        getUserPosts();
    } else {
        console.error("Error: Not logged into a user.")
    }
  }


  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    await makePost(postContent);
  }


  useEffect(() => {
    getUserPosts();
  }, []);


  return (
    <>
      <main onSubmit={handleSubmit} className="flex-1 flex flex-col items-center bg-gray-900">
        <section className="w-full flex flex-col items-center">
            <form className="bg-white w-[65%] p-4 m-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl text-black font-bold p-4">Create Post</h2>
                <textarea onChange={(e) => setPostContent(e.target.value)} className="w-full p-2 border-2 border-gray-900" placeholder="What's on your mind?"/>
                <button type="submit" className="flex flex-col items-center justify-center text-md text-white bg-purple-800 m-4 p-2 px-4 rounded-sm">Post</button>
            </form>
        </section>
        <section className="w-full flex flex-col items-center">
            {userPosts.map((p) => <PostCard key={p.id} post={p} />)}
        </section>
      </main>
    </>
  );
}
