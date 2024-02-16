import React, { useState, useEffect } from "react";
import axios from "axios";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const User = ({ user }) => {
  return (
    <tr className="user">
      <td>
        <img
          className="avatar"
          src={user.avatar_url}
          alt={user.login}
          width="50"
        />
      </td>
      <td>
        <a
          className="name"
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
        >
          {user.login}
        </a>
      </td>
    </tr>
  );
};

const App = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedInput = useDebounce(input, 300);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((page) => {
      if (page === 1) return page;
      else return page - 1;
    });
  };

  const handleNextPage = () => {
    setPage((page) => page + 1);
  };

  const handlePageLimit = (e) => {
    const value = e.target.value;
    setLimit(parseInt(value));
  };

  const fetchData = async () => {
    try {
      const searchResponse = await axios.get(
        `https://api.github.com/search/users?q=${input}`,
        {
          params: {
            page: page,
            per_page: limit,
            sort: "followers",
            order: "desc",
          },
        }
      );

      const items = searchResponse?.data?.items;
      
      console.log(items);
      setResults(items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (debouncedInput) {
      fetchData();
    } else {
      setResults([]);
    }
  }, [debouncedInput, page, limit]);

  return (
    <div className="App">
      <div className="header">
        <h1 className="title">Search Github User</h1>
      </div>
      <form className="form card" onSubmit={handleInputChange}>
        <input
          type="text"
          name="input"
          id="input"
          value={input}
          onChange={handleInputChange}
          onSubmit={handleInputChange}
          placeholder="Find a user..."
        />
      </form>
      <div className="search-result">
        <div className="options">
          <label>
            <small>Per Page</small>
            <select onChange={handlePageLimit}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
          </label>
          <div className="pagination">
            <button onClick={handlePrevPage}>{"< Prev"}</button>
            <button onClick={handleNextPage}>{"Next >"}</button>
          </div>
        </div>
        ...
        {results?.length != 0
          ? [
              <table className="result">
                <thead>
                  <tr className="result-header">
                    <th>
                      <p>People</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((user) => (
                    <User key={user.id} user={user} />
                  ))}
                </tbody>
              </table>,
            ]
          : []}
      </div>
    </div>
  );
};

export default App;
