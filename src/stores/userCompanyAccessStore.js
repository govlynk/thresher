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
			console.error("Failed to fetch user-company access:", err);
			set({ error: err.message || "Failed to fetch user-company access", loading: false });
		}
	},

	addUserCompanyAccess: async (roleData) => {
		if (!roleData.userId || !roleData.companyId || !roleData.access) {
			throw new Error("Missing required fields: userId, companyId, or access");
		}

		set({ loading: true, error: null });
		try {
			// Check if access already exists
			const existingAccess = await client.models.UserCompanyAccess.list({
				filter: {
					and: [{ userId: { eq: roleData.userId } }, { companyId: { eq: roleData.companyId } }],
				},
			});

			let response;
			if (existingAccess.data?.length > 0) {
				// Update existing access
				response = await client.models.UserCompanyAccess.update({
					id: existingAccess.data[0].id,
					access: roleData.access,
					status: roleData.status || "ACTIVE",
				});
			} else {
				// Create new access
				response = await client.models.UserCompanyAccess.create({
					userId: roleData.userId,
					companyId: roleData.companyId,
					access: roleData.access,
					status: roleData.status || "ACTIVE",
				});
			}

			if (!response?.data) {
				throw new Error("Failed to create user company access");
			}

			set((state) => ({
				UserCompanyAccesss: [...state.UserCompanyAccesss, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error adding user company access:", err);
			set({ error: err.message || "Failed to add user company access", loading: false });
			throw err;
		}
	},

	updateUserCompanyAccess: async (id, updates) => {
		if (!id) {
			throw new Error("Access ID is required");
		}

		set({ loading: true, error: null });
		try {
			const response = await client.models.UserCompanyAccess.update({
				id,
				...updates,
			});

			if (!response?.data) {
				throw new Error("Failed to update user company access");
			}

			set((state) => ({
				UserCompanyAccesss: state.UserCompanyAccesss.map((role) => (role.id === id ? response.data : role)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating user company access:", err);
			set({ error: err.message || "Failed to update user company access", loading: false });
			throw err;
		}
	},

	removeUserCompanyAccess: async (access) => {
		if (!access) {
			throw new Error("Access is required");
		}

		set({ loading: true, error: null });
		try {
			await client.models.UserCompanyAccess.delete({ access });

			set((state) => ({
				UserCompanyAccesss: state.UserCompanyAccesss.filter((role) => role.access !== access),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error removing user company access:", err);
			set({ error: err.message || "Failed to remove user company access", loading: false });
			throw err;
		}
	},
}));
