import { Link } from "react-router-dom";

export default function Navbar() {
  return (
   <div className="navbar">
  <div className="logo">FitTrack</div>
  <div className="links">
    <Link to="/">Dashboard</Link>
    <Link to="/workouts">Workouts</Link>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
  </div>
</div>

  );
}
