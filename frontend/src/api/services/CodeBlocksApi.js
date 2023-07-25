// api/services/CodeBlocksApi.js
import axios from "axios";
import { SERVER_URL } from "../Constants";

class CodeBlocksApi {
  async getCodeBlocks() {
    return await axios.get(`${SERVER_URL}/api/codeBlocks`);
  }

  async getCodeBlock(id) {
    console.log(id);
    return await axios.get(`${SERVER_URL}/api/codeBlocks/${id}`);
  }
}

export default new CodeBlocksApi();
