import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    // Fetch code blocks from the backend when the component mounts
    axios.get('http://localhost:5000/api/codeblocks')
      .then((response) => {
        setCodeBlocks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching code blocks:', error);
      });
  }, []);

  return (
    <div>
      <h1>Choose code block</h1>
      <ul>
        {codeBlocks.map((block) => (
          <li key={block.title}>
            <Link to={`/code/${encodeURIComponent(block.title)}`}>
              <button>{block.title}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyPage;
