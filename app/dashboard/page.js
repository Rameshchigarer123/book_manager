"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stats from './components/stats';
import AddBook from './components/AddBook';
import BookList from './components/BookList';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchBooks();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchBooks() {
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  }

  function handleBookAdded() {
    fetchBooks();
  }

  function handleBookUpdated() {
    fetchBooks();
  }

  async function handleBookDeleted(bookId) {
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchBooks();
      }
    } catch (error) {
      console.log('Delete error:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            📚 My Books
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user.name}!
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto p-6">
        <Stats books={books} />
        <AddBook onBookAdded={handleBookAdded} />
        <BookList 
          books={books} 
          onBookUpdated={handleBookUpdated}
          onBookDeleted={handleBookDeleted}
        />
      </div>
    </div>
  );
}


