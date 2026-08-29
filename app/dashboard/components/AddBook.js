import { useState } from 'react';

export default function Addbook(onBookAdded){
     const[title,setTitle]=useState("");
    const[author,setAuthor]=useState("");
    const[tags,setTags]=useState("");
    const [status, setStatus] = useState('want-to-read');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        try{
            const res=await fetch("api/books",{
                method:"POST",
                headers:{ 'Content-Type': 'application/json' },
                body:JSON.stringify({
                    title,author, tags:tagsArray,status
                })
            })
            const data= await res.json();

            if (res.ok) {
                setTitle('');
                setAuthor('');
                setTags('');
                setStatus('want-to-read');
                onBookAdded();
            } else {
                setError(data.message || 'Failed to add book');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    }
      return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div> 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div> 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="fiction, fantasy, adventure"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
        
      </form>
    </div>
  );
}
