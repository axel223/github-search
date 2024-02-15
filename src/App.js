import React, { useState, useEffect } from "react";
import axios from "axios";

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
      <td>{user.followers}</td>
    </tr>
  );
};


const App = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${input}`
      );

      const items = response?.data?.items;
      console.log(items);
      const sortedItems = items.sort(
        (a, b) => b.followers - a.followers
      );

      setResults(sortedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>GitHub User Search</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Enter a user name"
        />
        <button type="submit">Search</button>
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
