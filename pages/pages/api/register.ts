import React, { useState, useEffect } from 'react';
import BlogPost from '../components/BlogPost';
import BlogPostForm from '../components/BlogPostForm';
import { getBlogPosts, approveBlogPost } from '../services/api';
import { useSession } from 'next-auth/client';

export default function Dashboard() {
  const [session, loading] = useSession();
  const [blogPosts, setBlogPosts] = useState([]);

  async function fetchBlogPosts() {
    const posts = await getBlogPosts();
    setBlogPosts(posts);
  }

  useEffect(() => {
    if (!loading && (!session || !session.user.publisher)) {
      window.location.href = '/';
    } else {
      fetchBlogPosts();
    }
  }, [loading, session]);

  async function handleApprove(id) {
    try {
      await approveBlogPost(id);
      fetchBlogPosts();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreate(postData) {
    try {
      const post = await createBlogPost(postData);
      setBlogPosts([...blogPosts, post]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(id, postData) {
    try {
      const updatedPost = await updateBlogPost(id, postData);
      setBlogPosts(
        blogPosts.map((post) => (post.id === id ? updatedPost : post))
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteBlogPost(id);
      setBlogPosts(blogPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Dashboard</h1>
          <h2>Create new blog post</h2>
          <BlogPostForm onSubmit={handleCreate} />
          <h2>Manage blog posts</h2>
          {blogPosts.map((post) => (
            <BlogPost
              key={post.id}
              post={post}
              canEdit={session.user.author || session.user.publisher}
              canApprove={session.user.publisher}
              onApprove={() => handleApprove(post.id)}
              onUpdate={(postData) => handleUpdate(post.id, postData)}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
        </>
      )}
    </>
  );
}
