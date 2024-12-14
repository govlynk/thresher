import { create } from "zustand";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useUserCompanyAccessStore = create((set, get) => ({
	UserCompanyAccesss: [],
	loading: false,
	error: null,

	fetchUserCompanyAccesss: async (companyId) => {
		if (!companyId) {
			set({ error: "Company ID is required", loading: false });
			return;
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyAccess.list({
				filter: { companyId: { eq: companyId } },
			});

			if (!response?.data) {
				throw new Error("Invalid response from server");
			}

			set({ UserCompanyAccesss: response.data, loading: false, error: null });
		} catch (err) {
			console.error("Failed to fetch user-company roles:", err);
			set({ error: err.message || "Failed to fetch user-company roles", loading: false });
		}
	},

	addUserCompanyAccess: async (roleData) => {
		if (!roleData.userId || !roleData.companyId || !roleData.roleId) {
			throw new Error("Missing required fields: userId, companyId, or roleId");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyAccess.create({
				userId: roleData.userId,
				companyId: roleData.companyId,
				roleId: roleData.roleId,
				status: roleData.status || "ACTIVE",
			});

			if (!response?.data) {
				throw new Error("Failed to create user company role");
			}

			set((state) => ({
				UserCompanyAccesss: [...state.UserCompanyAccesss, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding user company role:", err);
			set({ error: err.message || "Failed to add user company role", loading: false });
			throw err;
		}
	},

	updateUserCompanyAccess: async (id, updates) => {
		if (!id) {
			throw new Error("Role ID is required");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyAccess.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update user company role");
			}

			set((state) => ({
				UserCompanyAccesss: state.UserCompanyAccesss.map((role) => (role.id === id ? response.data : role)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating user company role:", err);
			set({ error: err.message || "Failed to update user company role", loading: false });
			throw err;
		}
	},

	removeUserCompanyAccess: async (id) => {
		if (!id) {
			throw new Error("Role ID is required");
		}

		set({ loading: true, error: null });
		try {
			await client.models.UserCompanyAccess.delete({ id });

			set((state) => ({
				UserCompanyAccesss: state.UserCompanyAccesss.filter((role) => role.id !== id),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user company role:", err);
			set({ error: err.message || "Failed to remove user company role", loading: false });
			throw err;
		}
	},
}));
