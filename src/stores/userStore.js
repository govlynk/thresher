import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";

const client = generateClient();

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		set({ loading: true });

		// Clean up existing subscription
		const currentSub = get().subscription;
		if (currentSub) {
			currentSub.unsubscribe();
			set({ subscription: null });
		}

		try {
			// Get active company from global store state
			const activeCompany = useGlobalStore.getState().activeCompany;

			if (!activeCompany?.id) {
				set({
					users: [],
					loading: false,
					error: "No active company selected",
				});
				return;
			}

			// Fetch users for the active company
			const response = await client.models.User.list({
				filter: {
					companyId: { eq: activeCompany.id },
				},
			});

			set({
				users: response.data,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Fetch users error:", err);
			set({
				users: [],
				loading: false,
				error: err.message || "Failed to fetch users",
			});
		}
	},

	addUser: async (userData) => {
		set({ loading: true });

		try {
			const activeCompany = useGlobalStore.getState().activeCompanyId;
			console.log("Active company:", activeCompany);

			if (!activeCompany) {
				throw new Error("No active company selected");
			}

			const response = await client.models.User.create({
				...userData,
				companyId: activeCompany.id,
			});

			if (!response.data?.id) {
				throw new Error("User creation failed - invalid response");
			}

			const newUser = response.data;

			set((state) => ({
				users: [...state.users, newUser],
				loading: false,
				error: null,
			}));

			return newUser;
		} catch (err) {
			console.error("Add user error:", err);
			const errorMessage = err.message || "Failed to add user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	updateUser: async (id, updates) => {
		set({ loading: true });

		try {
			const response = await client.models.User.update({
				id,
				...updates,
			});

			if (!response.data?.id) {
				throw new Error("User update failed - invalid response");
			}

			const updatedUser = response.data;

			set((state) => ({
				users: state.users.map((user) => (user.id === id ? updatedUser : user)),
				loading: false,
				error: null,
			}));

			return updatedUser;
		} catch (err) {
			console.error("Update user error:", err);
			const errorMessage = err.message || "Failed to update user";
			set({ error: errorMessage, loading: false });
			throw new Error(errorMessage);
		}
	},

	deleteUser: async (id) => {
		set({ loading: true });

		try {
			await client.models.User.delete({ id });

			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Delete user error:", err);
			const errorMessage = err.message || "Failed to delete user";
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
