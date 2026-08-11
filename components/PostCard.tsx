"use client";
import { ThumbsUp } from "lucide-react";
import { ThumbsDown } from "lucide-react";
import { Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import type { Post } from "@/types/post";
import type { User } from "@supabase/supabase-js";


export default function PostCard({ post }: { post: Post }) {

    // const [isUserPost, setIsUserPost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null)
    const [postLiked, setPostLiked] = useState(false);
    const [postDisliked, setPostDisliked] = useState<boolean | null>(null);
    const [postLikes, setPostLikes] = useState(0);
    const [postDislikes, setPostDislikes] = useState(0);
    const [postDeleted, setPostDeleted] = useState(false);

    

    async function updateUser() {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
            console.log(error);
            return;
        }

        const currentUser = data.user;

        if (currentUser) {
            setUser(currentUser);
        } else {
            console.log("User not logged in.");
        }
    }


    async function updatePostLikesCount() {
        const postLikesRequest = await supabase.from("post_likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);
        const postLikesCount = postLikesRequest.count;
        if (postLikesCount !== null) {
            setPostLikes(postLikesCount);
        } else {
            console.error("Error: Likes not found.");
        }
    }


    async function updatePostDislikesCount() {
        const postDislikesRequest = await supabase.from("post_dislikes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);
        const postDislikesCount = postDislikesRequest.count;
        if (postDislikesCount !== null) {
            setPostDislikes(postDislikesCount);
        } else {
            console.error("Error: Dislikes not found.");
        }
    }


    async function updatePostLiked() {
        if (user) {
            const userLikeRequest = await supabase
                .from("post_likes")
                .select()
                .eq("user_id", user.id)
                .eq("post_id", post.id);
            const { data, error } = userLikeRequest;
            
            if (error) {
                console.log(error);
                return;
            }
 
            setPostLiked(data.length > 0);
            
        } else {
            console.log("User not logged in. Can't select from post_likes.");
        }
    }


    async function updatePostDisliked() {
        if (user) {
            const userDislikeRequest = await supabase
                .from("post_dislikes")
                .select()
                .eq("user_id", user.id)
                .eq("post_id", post.id);
            const { data, error } = userDislikeRequest;
            
            if (error) {
                console.log(error);
                return;
            }

            setPostDisliked(data.length > 0);
        
        } else {
            console.log("User not logged in. Can't select from post_dislikes.");
        }
    }


    async function likePost() {
        
        if (postDisliked) {
            await dislikePost();
        }

        if (user) {
            
            const userLikeRequest = await supabase.from("post_likes")
                .select()
                .eq("user_id", user.id)
                .eq("post_id", post.id);

            const userLike = userLikeRequest.data!;

            if (userLike.length > 0) {
                await supabase.from("post_likes")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", post.id);
            } else {
                await supabase.from("post_likes").insert({
                    user_id: user.id,
                    post_id: post.id
                });
            }

            await updatePostLikesCount();
            await updatePostLiked();

        } else {
            console.log("User not logged in. Can't like post.");
        }
    }


    async function dislikePost() {

        if (postLiked) {
            await likePost();
        }

        if (user) {
            
            const userDislikeRequest = await supabase.from("post_dislikes")
                .select()
                .eq("user_id", user.id)
                .eq("post_id", post.id);

            const userDislike = userDislikeRequest.data!;

            if (userDislike.length > 0) {
                await supabase.from("post_dislikes")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", post.id);
            } else {
                await supabase.from("post_dislikes").insert({
                    user_id: user.id,
                    post_id: post.id
                });
            }

            await updatePostDislikesCount();
            await updatePostDisliked();

        } else {
            console.log("User not logged in. Can't dislike post.");
        }
    }


    async function updatePosts() {
        await updateUser();

        await updatePostLikesCount();
        await updatePostDislikesCount();

        await updatePostLiked();
        await updatePostDisliked(); 

        setLoading(false);
    }


    async function deletePost() {
        if (!user) {
            console.log("User not logged in. Can't delete post.");
            return;
        }

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("user_id", user.id)
            .eq("id", post.id);

        setPostDeleted(true);

        if (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        updatePosts();
    }, [postLikes, postDislikes])


    return(
        <>  
            {
                postDeleted || loading ?
                <></>
                :
                <article className="bg-white w-[65%] flex flex-col justify-center items-center p-4 m-4 rounded-4xl rounded-tl-none">
                    <div className="w-full flex flex-row justify-start">
                        <span className="text-sm italic p-2">
                                {
                                    new Date(post.created_at).toLocaleString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit"
                                        }
                                    )
                                }
                        </span>
                    </div>
                    <p className="text-md p-2">{post.content}</p>
                    <div className="w-[65%] flex flex-row justify-evenly items-center p-2">
                        <div className="flex flex-row items-center">
                            <button onClick={likePost}>
                                {
                                    postLiked ? 
                                    <ThumbsUp size={36} className="p-1 px-2 text-purple-800"/>
                                    :
                                    <ThumbsUp size={36} className="p-1 px-2"/>
                                }
                            </button>
                            <span className="text-md p-1 px-2">{postLikes}</span>
                        </div>
                        <div className="flex flex-row items-center">
                            <button onClick={dislikePost}>
                                {
                                    postDisliked ?
                                    <ThumbsDown size={36} className="p-1 px-2 text-purple-800"/>
                                    :
                                    <ThumbsDown size={36} className="p-1 px-2"/>
                                }
                            </button>
                            <span className="text-md p-1 px-2">{postDislikes}</span>
                        </div>
                        {
                            user?.id === post.user_id ?
                            <div className="flex flex-row items-center">
                                <button onClick={deletePost}>
                                    <Trash size={24} />
                                </button>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </article>
            }
        </>
    )
}