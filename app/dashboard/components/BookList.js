import { useState } from "react";
export default function BookList({ books, onBookUpdated, onBookDeleted }) {
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editStatus, setEditStatus] = useState('want-to-read');
  const [saving, setSaving] = useState(false);

  const filteredBooks = filter === 'all' ? books : books.filter(book => book.status === filter);

  function startEditing(book) {
    setEditingId(book._id);
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditTags(book.tags ? book.tags.join(', ') : '');
    setEditStatus(book.status);
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function saveEdit(bookId) {
    setSaving(true);
    try {
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(t => t);
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          tags: tagsArray,
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        onBookUpdated();
      }
    } catch (err) {
      console.log('Edit error:', err);
    } finally {
      setSaving(false);
    }
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No books yet
        </h3>
        <p className="text-gray-500">
          Start adding books to your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Books</h2>
        <div>
          <label className="text-sm text-gray-600 mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Books</option>
            <option value="want-to-read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            {editingId === book._id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="Author"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(book._id)}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>

                  {book.tags && book.tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {book.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded text-sm ${
                    book.status === 'want-to-read' ? 'bg-blue-100 text-blue-700' :
                    book.status === 'reading' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {book.status === 'want-to-read' ? 'Want to Read' :
                     book.status === 'reading' ? 'Reading' :
                     'Completed'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(book)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onBookDeleted(book._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
}


