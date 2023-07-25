import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CodeBlocksApi from '../api/services/CodeBlocksApi';
import '../css/Lobby.css'; 

const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    CodeBlocksApi.getCodeBlocks().then(resp => {
      if (resp.status === 200) {
        setCodeBlocks(resp.data);
      }
    });
  }, []);

  return (
    <div className="lobby-container"> 
      <p className="lobby-title">Choose code block</p> 
      <ul>
        {codeBlocks.map((block) => (
          <li key={block.title}>
            <Link to={`/code/${encodeURIComponent(block._id)}`}>
              <button className="code-block-button"> 
                {block.title}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;