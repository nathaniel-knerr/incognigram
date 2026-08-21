"use client";
import PostCard from "@/components/PostCard";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Post } from "@/types/post";


export default function Profile() {

  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [postContent, setPostContent] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(true);


  async function getUserPosts() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
        console.error(userError);
        return;
    }

    const user = userData.user;

    const { data: postsData, error: postsError } = await supabase.from("posts")
        .select()
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
            
    if (postsError) {
        console.error(postsError);
        return;
    } 
        
    setUserPosts(postsData);
    setLoadingPosts(false);

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


  function resizePostArea(postTextArea: HTMLTextAreaElement) {
    postTextArea.style.height = `${postTextArea.scrollHeight}px`;
  }


  function updatePostArea(postTextArea: HTMLTextAreaElement) {
    setPostContent(postTextArea.value);
    resizePostArea(postTextArea);
  }

  useEffect(() => {
    getUserPosts();
  }, []);


  return (
    <>
      <main onSubmit={handleSubmit} className="flex-1 flex flex-col items-center bg-gray-900">
        <section className="w-full flex flex-col items-center">
            <form className="bg-gray-700 w-full md:w-[65%] p-4 m-4 flex flex-col items-center justify-center">
                <h2 className="text-2xl text-white font-bold p-4">Create Post</h2>
                <textarea onChange={(e) => updatePostArea(e.target)} className="w-full md:w-[65%] text-md outline-purple-700 h-10 p-2 border-none bg-white resize-none overflow-hidden" placeholder="What's on your mind?"/>
                <button type="submit" className="flex flex-col items-center justify-center text-md text-white bg-purple-700 m-4 p-2 px-4 rounded-sm">Post</button>
            </form>
        </section>
        <section className="w-full flex flex-col items-center">
            {loadingPosts ?
            <div className="w-16 h-16 animate-spin rounded-full border-6 border-purple-700 border-t-transparent"></div>
            :
            <>
            {userPosts.map((p) => <PostCard key={p.id} post={p} />)}
            </>
            }
        </section>
      </main>
    </>
  );
}
