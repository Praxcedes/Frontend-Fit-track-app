import { useState } from "react";
import api from "../services/api";
import "../styles/ExerciseForm.css";

export default function ExerciseForm({ workoutId, onAdd }) {
  const [form, setForm] = useState({ name: "", sets: "", reps: "", weight: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await api.post("/exercises/", { ...form, workout_id: workoutId });
    onAdd(res.data);
    setForm({ name: "", sets: "", reps: "", weight: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded mt-3 flex flex-col gap-2">
      <input name="name" placeholder="Exercise" value={form.name} onChange={handleChange} required />
      <input name="sets" placeholder="Sets" value={form.sets} onChange={handleChange} required />
      <input name="reps" placeholder="Reps" value={form.reps} onChange={handleChange} required />
      <input name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Exercise</button>
    </form>
  );
}
