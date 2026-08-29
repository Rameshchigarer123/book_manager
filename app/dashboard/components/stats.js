export default function Stats({ books }) {
  const total = books.length;
  const wantToRead = books.filter(b => b.status === 'want-to-read').length;
  const reading = books.filter(b => b.status === 'reading').length;
  const completed = books.filter(b => b.status === 'completed').length;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500">
        <div className="text-3xl font-bold text-blue-600">{total}</div>
        <div className="text-gray-600 text-sm mt-1">Total Books</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-400">
        <div className="text-3xl font-bold text-blue-500">{wantToRead}</div>
        <div className="text-gray-600 text-sm mt-1">Want to Read</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-yellow-400">
        <div className="text-3xl font-bold text-yellow-500">{reading}</div>
        <div className="text-gray-600 text-sm mt-1">Currently Reading</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-400">
        <div className="text-3xl font-bold text-green-500">{completed}</div>
        <div className="text-gray-600 text-sm mt-1">Completed</div>
      </div>
    </div>
  );
}