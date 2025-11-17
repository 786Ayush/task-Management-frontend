"use client";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface TaskType {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const fetchData = async () => {
    try {
      const res = await api.get("/task");
      setTasks(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await api.post("/task/create", { title, description });
    if (response.status === 200) {
      fetchData();
    }
    toast.success("New Task Added!");
    setTitle("");
    setDescription("");
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await api.put("/task/delete", { taskId: id });
      if (response.status === 200) fetchData();
      toast.success("Task Deleted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (id: string, status: string) => {
    try {
      const response = await api.post("/task/update", { taskId: id, status });
      if (response.status === 200) fetchData();
      toast.success("Status Changed Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  const HandleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) router.push("/login");
      toast.success("Logout Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r py-2 from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
          Task Manager
        </h1>

        <button
          onClick={HandleLogout}
          className="px-6 py-2 bg-white/20 backdrop-blur-lg border border-white/40 text-gray-800 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-white/40 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-5 border border-white/40 transition-all duration-300 hover:shadow-purple-300/40"
      >
        <input
          type="text"
          className="w-full p-4 border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-4 border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          placeholder="Describe your task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition"
        >
          Add Task
        </button>
      </form>

      {/* Tasks List */}
      <div className="mt-10 max-w-3xl mx-auto space-y-5">
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center">No tasks yet!</p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-6 flex justify-between items-start hover:shadow-purple-200 hover:scale-[1.01] transition-all"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h2>
              <p className="text-gray-600">{task.description}</p>

              <select
                className={`mt-3 px-4 py-2 rounded-full text-sm font-semibold shadow cursor-pointer transition
                  ${
                    task.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
                value={task.status}
                onChange={(e) => editTask(task.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 hover:shadow-lg transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
