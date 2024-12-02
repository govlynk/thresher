import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useTodoStore = create((set, get) => ({
	todos: [],
	loading: false,
	error: null,
	subscription: null,

	fetchTodos: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.Todo.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						todos: items.sort((a, b) => a.position - b.position),
						loading: false,
					});
				},
				error: (err) => {
					console.error("Fetch todos error:", err);
					set({ error: "Failed to fetch todos", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch todos error:", err);
			set({ error: "Failed to fetch todos", loading: false });
		}
	},

	addTodo: async (todoData) => {
		if (!todoData.title || !todoData.description || !todoData.dueDate) {
			throw new Error("Missing required fields: title, description, or due date");
		}

		if (!todoData.assigneeId) {
			throw new Error("No assignee ID provided");
		}

		if (!todoData.teamId) {
			throw new Error("No team ID provided");
		}

		set({ loading: true, error: null });
		try {
			const todo = await client.models.Todo.create({
				title: todoData.title.trim(),
				description: todoData.description.trim(),
				status: todoData.status || "TODO",
				priority: todoData.priority || "MEDIUM",
				dueDate: todoData.dueDate,
				estimatedEffort: todoData.estimatedEffort || 0,
				actualEffort: todoData.actualEffort || 0,
				tags: todoData.tags || [],
				position: todoData.position || 0,
				assigneeId: todoData.assigneeId,
				teamId: todoData.teamId,
			});

			set((state) => ({
				todos: [...state.todos, todo],
				loading: false,
				error: null,
			}));

			return todo;
		} catch (err) {
			console.error("Create todo error:", err);
			set({ error: err.message || "Failed to create todo", loading: false });
			throw err;
		}
	},

	updateTodo: async (id, updates) => {
		try {
			const updatedTodo = await client.models.Todo.update({
				id,
				...updates,
			});

			set((state) => ({
				todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
				error: null,
			}));
			return updatedTodo;
		} catch (err) {
			console.error("Error updating todo:", err);
			set({ error: "Failed to update todo" });
			throw err;
		}
	},

	updateTodos: async (newTodos) => {
		try {
			for (let i = 0; i < newTodos.length; i++) {
				const todo = newTodos[i];
				await client.models.Todo.update({
					id: todo.id,
					position: i + 1,
					status: todo.status,
				});
			}
			set({ todos: newTodos, error: null });
		} catch (err) {
			console.error("Error updating todos:", err);
			set({ error: "Failed to update todos" });
			throw err;
		}
	},

	removeTodo: async (id) => {
		try {
			await client.models.Todo.delete({
				id,
			});
			set((state) => ({
				todos: state.todos.filter((todo) => todo.id !== id),
				error: null,
			}));
		} catch (err) {
			console.error("Error removing todo:", err);
			set({ error: "Failed to remove todo" });
			throw err;
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
