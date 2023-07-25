export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? "https://mentor-student-coding-backend.vercel.app"
    : "http://localhost:8106";
