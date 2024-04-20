import { useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Progress from './Progress';
import './App.css';
import paw from './assets/paw.svg';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [pageNumbers, setPageNumbers] = useState([]);
  const resultsPerPage = 15;

  const fetchResults = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('query', query);
      const response = await axios.post('https://faunafind.onrender.com/api/v1/search', formData);
      setResults(response.data);
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(response.data.length / resultsPerPage); i++) {
        pageNumbers.push(i);
      }
      setPageNumbers(pageNumbers);
      if (response.data.length === 0) {
        setError('No results found');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setResults([]);
    if (!query) {
      setError('Please enter a search query');
      return;
    }
    setError(null);
    setCurrentPage(1);
    fetchResults();
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const renderResults = () => {
    if (loading) {
      return <div className='d-flex justify-content-center m-3'>
        <ReactLoading type='bubbles' color="#007bff" height={60} width={60} />
      </div>;
    }

    return currentResults.map((result) => (
      <div key={result.image_url} className="col-md-4 mb-3">
        <div className="card">
          <img src={result.image_url} className="card-img-top" alt={result.alt_text} />
          <div className="card-body">
            <h5 className="card-title">{result.alt_text}</h5>
            <Progress className="my-2" similarity={result.similarity} />
          </div>
        </div>
      </div>
    ));
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid p-3">
      <div className='d-flex align-items-center justify-content-center'>
        <img src={paw} alt="FaunaFind Logo" className="logo" />
        <h1 className="text-center mb-0">Fauna<span>Find</span></h1>

      </div>
      <div>
        <input type="search" className="form-control my-3 full-width" placeholder="Search..." name="" value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDownCapture={(e) => e.key === 'Enter' && handleSearch()} />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {renderResults()}
      </div>
      {results.length > resultsPerPage && (
        <div className="pagination justify-content-center align-items-center gap-2">
          <button
            className="btn btn-primary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          Page {currentPage} of {pageNumbers.length}
          <button
            className="btn btn-primary"
            disabled={currentPage === pageNumbers.length}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
