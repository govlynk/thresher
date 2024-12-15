// src/stores/userStore.js
import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "./globalStore";
import { getUsersByCompany, createUserWithCompanyRole, deleteUserAndRoles } from "../utils/userUtils";

const client = generateClient({
	authMode: "userPool",
});

export const useUserStore = create((set, get) => ({
	users: [],
	loading: false,
	error: null,
	subscription: null,

	fetchUsers: async () => {
		const { activeCompanyId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			set({
				users: [],
				loading: false,
				error: "No active company selected",
			});
			return;
		}

		set({ loading: true, error: null });

		try {
			const users = await getUsersByCompany(activeCompanyId);
			set({
				users,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching users:", err);
			set({
				error: err.message || "Failed to fetch users",
				loading: false,
			});
		}
	},

	addUser: async (userData) => {
		const { activeCompanyId } = useGlobalStore.getState();

		if (!activeCompanyId) {
			throw new Error("No active company selected");
		}

		set({ loading: true, error: null });

		try {
			const newUser = await createUserWithCompanyRole(userData, activeCompanyId);
			set((state) => ({
				users: [...state.users, newUser],
				loading: false,
				error: null,
			}));
			return newUser;
		} catch (err) {
			console.error("Error adding user:", err);
			set({
				error: err.message || "Failed to add user",
				loading: false,
			});
			throw err;
		}
	},

	updateUser: async (id, updates) => {
		if (!id) {
			throw new Error("User ID is required");
		}

		set({ loading: true, error: null });

		try {
			const response = await client.models.User.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update user");
			}

			set((state) => ({
				users: state.users.map((user) => (user.id === id ? { ...user, ...response.data } : user)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating user:", err);
			set({
				error: err.message || "Failed to update user",
				loading: false,
			});
			throw err;
		}
	},

	removeUser: async (id) => {
		if (!id) {
			throw new Error("User ID is required");
		}

		set({ loading: true, error: null });

		try {
			await deleteUserAndRoles(id);
			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user:", err);
			set({
				error: err.message || "Failed to remove user",
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		set({
			users: [],
			loading: false,
			error: null,
		});
	},
}));
