"use client";
import BlogFormPage from "../BlogForm";
export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <BlogFormPage postId={parseInt(params.id, 10)} />;
}
