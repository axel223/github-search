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
    <tr>
      <td>
        <img src={user.avatar_url} alt={user.login} width="50" />
      </td>
      <td>
        <a href={user.html_url} target="_blank" rel="noreferrer">
          {user.login}
        </a>
      </td>
      <td>{user.name}</td>
    </tr>
  );
};


const App = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const debouncedInput = useDebounce(input, 300);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${input}`, {
          params: {
            page: 1,
            per_page: 50,
            sort: 'followers',
            order: 'desc',
          }
        }
      );

      const items = response?.data?.items;
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
  }, [debouncedInput]);

  return (
    <div className="App">
      <h1>GitHub User Search</h1>
      <form>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter a user name"
        />
      </form>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {results.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
