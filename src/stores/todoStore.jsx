import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { useTeamTodoStore } from "./teamTodoStore";

const client = generateClient({
	authMode: "userPool",
});

export const useTodoStore = create((set, get) => ({
	// State
	todos: [],
	activeId: null,
	loading: false,
	error: null,
	subscription: null,
	columnLimits: {
		TODO: 10,
		DOING: 5,
		DONE: Infinity,
	},

	// Basic Setters
	setActiveId: (id) => set({ activeId: id }),
	setColumnLimit: (status, limit) =>
		set((state) => ({
			columnLimits: { ...state.columnLimits, [status]: limit },
		})),

	// Todo Management
	fetchTodos: async () => {
		const { activeCompanyId, activeTeamId } = useGlobalStore.getState();
		if (!activeCompanyId) {
			set({ todos: [], loading: false, error: "No active company selected" });
			return;
		}

		// Cleanup existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
		}

		set({ loading: true });
		try {
			// Build filter based on active team selection
			const filter = activeTeamId && activeTeamId !== "all" ? { teamId: { eq: activeTeamId } } : undefined;

			const subscription = client.models.Todo.observeQuery({
				filter,
				sort: (s) => s.position("ASCENDING"),
			}).subscribe({
				next: ({ items }) => {
					set({
						todos: items.sort((a, b) => a.position - b.position),
						loading: false,
						error: null,
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
				position: todoData.position || 1,
				dueDate: todoData.dueDate,
				estimatedEffort: todoData.estimatedEffort || 0,
				actualEffort: todoData.actualEffort || 0,
				tags: todoData.tags || [],
				assigneeId: todoData.assigneeId,
				teamId: todoData.teamId,
				sprintId: todoData.sprintId || null,
			});

			set({ loading: false, error: null });
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

			set({ error: null });
			return updatedTodo;
		} catch (err) {
			console.error("Error updating todo:", err);
			set({ error: "Failed to update todo" });
			throw err;
		}
	},

	moveTodo: async (todoId, newStatus, newPosition) => {
		set((state) => {
			const todo = state.todos.find((t) => t.id === todoId);
			if (!todo) return state;

			const statusTodos = state.todos
				.filter((t) => t.status === newStatus && t.sprintId === todo.sprintId)
				.sort((a, b) => a.position - b.position);

			const updatedPositions = statusTodos.map((t, index) => ({
				...t,
				position: index >= newPosition ? index + 1 : index,
			}));

			const updatedTodos = state.todos
				.filter((t) => t.id !== todoId && (t.status !== newStatus || t.sprintId !== todo.sprintId))
				.concat(updatedPositions);

			return {
				todos: [...updatedTodos, { ...todo, status: newStatus, position: newPosition }],
			};
		});

		try {
			await client.models.Todo.update({
				id: todoId,
				status: newStatus,
				position: newPosition,
			});
		} catch (err) {
			console.error("Error moving todo:", err);
			// Refresh todos to ensure UI matches backend state
			get().fetchTodos();
		}
	},

	removeTodo: async (id) => {
		set({ loading: true, error: null });
		try {
			// Remove todo from local state first for immediate UI update
			set((state) => ({
				todos: state.todos.filter((todo) => todo.id !== id),
			}));

			// Then delete from database
			await client.models.Todo.delete({ id });
			set({ loading: false, error: null });
		} catch (err) {
			console.error("Error removing todo:", err);
			set({ error: "Failed to remove todo", loading: false });
			// Refresh todos if delete failed
			const { activeCompanyId, activeTeamId } = useGlobalStore.getState();
			if (activeCompanyId) {
				const filter = activeTeamId && activeTeamId !== "all" ? { teamId: { eq: activeTeamId } } : undefined;

				const response = await client.models.Todo.list({ filter });
				set({ todos: response.data || [] });
			}
			throw err;
		}
	},

	// Cleanup
	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
		set({
			todos: [],
			loading: false,
			error: null,
			subscription: null,
		});
	},
}));
