import { useState, useEffect } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController(); // to cancel fetch if component unmounts

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          ...options,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // cleanup on unmount
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

export default useFetch;


//import useFetch from '../hooks/useFetch';
// const { data, loading, error } = useFetch("https://api.example.com/data");
// if (loading) return <p>Loading...</p>;
// if (error) return <p>Error: {error}</p>;
//   return (
    // <div>
      {/* <h1>Data:</h1> */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
{/* </div> */ }
    

// For GET
// const { data, loading, error } = useFetch('https://api.example.com/items');

// // For POST
// const { data, loading, error } = useFetch('https://api.example.com/items', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ name: 'New Item' }),
// });
