import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		set({ loading: true });
		try {
			const subscription = client.models.User.observeQuery().subscribe({
				next: ({ items }) => {
					set({
						users: items,
						loading: false,
						error: null,
					});
				},
				error: (err) => {
					console.error("Fetch users error:", err);
					set({ error: "Failed to fetch users", loading: false });
				},
			});
			set({ subscription });
		} catch (err) {
			console.error("Fetch users error:", err);
			set({ error: "Failed to fetch users", loading: false });
		}
	},

	addUser: async (userData) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.User.create(userData);

			if (!response?.data?.id) {
				throw new Error("User creation failed - invalid response");
			}

			const user = response.data;

			set((state) => ({
				users: [...state.users, user],
				loading: false,
				error: null,
			}));

			return user;
		} catch (err) {
			console.error("Create user error:", err);
			const errorMessage = err.message || "Failed to create user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	updateUser: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const response = await client.models.User.update({
				id,
				...updates,
			});

			if (!response?.data?.id) {
				throw new Error("User update failed - invalid response");
			}

			const user = response.data;

			set((state) => ({
				users: state.users.map((u) => (u.id === id ? user : u)),
				loading: false,
				error: null,
			}));

			return user;
		} catch (err) {
			console.error("Update user error:", err);
			const errorMessage = err.message || "Failed to update user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	removeUser: async (id) => {
		set({ loading: true, error: null });
		try {
			await client.models.User.delete({ id });

			set((state) => ({
				users: state.users.filter((u) => u.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Remove user error:", err);
			const errorMessage = err.message || "Failed to remove user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	cleanup: () => {
		const { subscription } = get();
		if (subscription) {
			subscription.unsubscribe();
		}
	},
}));
