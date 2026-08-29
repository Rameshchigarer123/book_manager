import { useState } from "react";
export default function BookList({books,onBookUpdated,onBookDeleted}){
    const [filter, setFilter] = useState('all');
    const filteredBooks = filter === 'all'?books:books.filter(book => book.status === filter);
    if(books.length===0){
        return(
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">Stack of Books</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Book Added
                </h3>
                <p className="text-gray-500">
                    Start adding books to your collection!
                </p>
            </div>
        )
    }
      if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">Stack of Books</div>
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
        <h2 className="text-xl font-semibold"> Your Books</h2>
        <div>
          <label className="text-sm text-gray-600 mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Books</option>
            <option value="want-to-read"> Want to Read</option>
            <option value="reading"> Reading</option>
            <option value="completed"> Completed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
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
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded text-sm ${
                  book.status === 'want-to-read' ? 'bg-blue-100 text-blue-700' :
                  book.status === 'reading' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {book.status === 'want-to-read' ? ' Want to Read' :
                   book.status === 'reading' ? ' Reading' :
                   ' Completed'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onBookUpdated(book)}
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
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredBooks.length} of {books.length} books
      </div>
    </div>
  );
}
