import React from 'react';
import BlogView from './BlogView';

const Blog = (props) => {
  const blogPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      category: 'UI/ UX Design',
      author: 'Jayesh Patil',
      date: '10 Nov, 2023',
      title: 'Design Unraveled: Behind the Scenes of UI/UX Magic',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      category: 'App Design',
      author: 'Jayesh Patil',
      date: '09 Oct, 2023',
      title: 'Sugee: Loan Management System for Rural Sector.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1574267432644-f610c75e4d02?w=800',
      category: 'App Design',
      author: 'Jayesh Patil',
      date: '13 Aug, 2023',
      title: 'Cinetrade: Innovative way to invest in Digital Media',
    },
  ];

  return <BlogView blogPosts={blogPosts} {...props} />;
};

export default Blog;