
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const CodeBlockPage = () => {
  const { title } = useParams();
  const [codeBlockContent, setCodeBlockContent] = useState('');
  const [userType] = useState('student'); // Assume userType is set elsewhere in your code
  const socketRef = useRef();
  const [isCorrect] = useState(false);


  useEffect(() => {
    // Fetch the code block content from the backend based on the title parameter
    axios.get(`http://localhost:5000/api/codeblocks/${encodeURIComponent(title)}`)
    .then((response) => {
      setCodeBlockContent(response.data.code); // Assuming the content is stored in the "code" property
    })
    .catch((error) => {
      console.error('Error fetching code block content:', error);
    });

    // Establish WebSocket connection when the component mounts
    socketRef.current = io('http://localhost:3000');

    // Listen for codeChange events from the server
    socketRef.current.on('codeChange', (data) => {
      // Update the code block content with the received code change
      setCodeBlockContent(data);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, [title]);

  const handleCodeChange = (newCode) => {
    // Send the code change to the server
    socketRef.current.emit('codeChange', newCode);

    // Update the code block content locally to provide instant feedback to the user
    setCodeBlockContent(newCode);
  };

  return (
    <div>
      <h1>{title}</h1>
      {userType === 'mentor' ? (
        <div>
          <p>This is read-only mode for the mentor</p>
          {/* Display the code block content in read-only mode */}
          <pre>{codeBlockContent}</pre>
        </div>
      ) : (
        <div>
          <p>This is editable mode for the student</p>
          {/* Your code editor component */}
          <textarea value={codeBlockContent} onChange={(e) => handleCodeChange(e.target.value)} />
          {isCorrect && <div>😊 Big Smiley Face! You did it!</div>}
        </div>
      )}
    </div>
  );
};

export default CodeBlockPage;
