import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import CodeBlocksApi from '../../api/services/CodeBlocksApi';
import { SERVER_URL } from '../../api/Constants';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../../css/CodeBlockPage.css';
import smileyImage from '../../css/smiley.png'; // Import the smiley image





const CodeBlockPage = () => {
  const { id } = useParams();
  const [codeBlockData, setCodeBlockData] = useState({title: "", description: ""});
  const [codeBlockContent, setCodeBlockContent] = useState('');
  const [userType, setUserType] = useState('student'); 
  const socketRef = useRef();
  const [isCorrect,setIsCorrect] = useState(false);
  const webSocketServerURL = 'https://mentor-student-coding-backend.vercel.app/'; 



  useEffect(() => {
    CodeBlocksApi.getCodeBlock(id).then((resp) => {
      if (resp.status !== 200)
        return;
      setCodeBlockContent(resp.data.code);
      setCodeBlockData(resp.data);
    });

    socketRef.current = io(SERVER_URL);


    socketRef.current.on("myRole", (roleData) => {
      const whoamI = JSON.parse(roleData).role;
      setUserType(whoamI);
      socketRef.current.on(id, (data) => {
        console.log(`Got data from room i-am(${whoamI})`, data);
        if (whoamI !== 'student')
          setCodeBlockContent(data);
      });
    }, [id, webSocketServerURL]);
    

    socketRef.current.emit("joinCodeBlock", JSON.stringify({ id: id }));

    return () => {
      socketRef.current.disconnect();
    };
  },);

  const handleCodeChange = (newCode) => {
    if (userType !== 'student')
      return;

    socketRef.current.emit('codeChange', JSON.stringify({ room: id, text: newCode }));

    setCodeBlockContent(newCode);

    const solutionCode = codeBlockData.solution;
    setIsCorrect(newCode.trim() === solutionCode.trim());
  };

  return (
    <div className="code-block-container">
      {/* <h1>{codeBlockData.title}</h1> */}
      <title>{codeBlockData.title}</title>

      {userType === 'mentor' ? (
        <div>
          <user>This is read-only mode for the mentor</user>
          <description>{codeBlockData.description}</description>

          <pre>
            <code>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {codeBlockContent}
              </SyntaxHighlighter>
            </code>
          </pre>
          {codeBlockContent === codeBlockData.solution && (
            <div className="smiley-container">
            <img src={smileyImage} alt="Smiley" className="smiley-image" />
          </div>
          )}
        </div>
      ) : (
        <div>
          <user>This is editable mode for the student</user>
          <description>{codeBlockData.description}</description>

          <textarea
            value={codeBlockContent}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="code-block-textarea"
          />
          {isCorrect && (
            <div className="smiley-container">
            <img src={smileyImage} alt="Smiley" className="smiley-image" />
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeBlockPage;