import { Link } from "react-router-dom";

export default function WorkoutCard({ workout }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{workout.title}</h2>
      <p>{workout.date}</p>
      <Link to={`/workouts/${workout.id}`} className="text-blue-500">
        View
      </Link>
    </div>
  );
}
