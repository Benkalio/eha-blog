import React from 'react';
import BlogPost from '../components/BlogPost';
import { getApprovedBlogPosts } from '../services/api';

export default function Home({ blogPosts }) {
  return (
    <div>
      <h1>Welcome to our blog!</h1>
      {blogPosts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const blogPosts = await getApprovedBlogPosts();
  return {
    props: { blogPosts },
  };
}
