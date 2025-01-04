import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

export const useAuthStore = create()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isAdmin: false,
			isGovLynk: false,
			isGovLynkAdmin: false,
			groups: [],
			authDetails: null,

			initialize: async (cognitoUser) => {
				console.log("[AuthStore] Initializing auth", cognitoUser);
				if (!cognitoUser) {
					set({
						user: null,
						isAuthenticated: false,
						isAdmin: false,
						isGovLynk: false,
						isGovLynkAdmin: false,
						groups: [],
						authDetails: null,
					});
					return;
				}

				try {
					// Extract basic auth information
					const authInfo = {
						username: cognitoUser.username,
						userId: cognitoUser.userId,
						sub: cognitoUser.userId,
						email: cognitoUser.signInDetails?.loginId,
						authFlowType: cognitoUser.signInDetails?.authFlowType,
					};
					console.log("[AuthStore] Auth info:", authInfo);

					// Extract groups from Cognito token
					const groups = cognitoUser.signInUserSession?.accessToken?.payload?.["cognito:groups"] || [];
					console.log("[AuthStore] User groups:", groups);

					// Create normalized user object without requiring database user
					const normalizedUser = {
						...authInfo,
						id: cognitoUser.userId, // Use Cognito ID as user ID
						name: cognitoUser.username,
						email: cognitoUser.signInDetails?.loginId,
						groups,
						companies: [],
						signInUserSession: cognitoUser.signInUserSession,
					};
					console.log("[AuthStore] Normalized user:", normalizedUser);
					// Try to fetch additional user data if it exists
					try {
						const response = await client.models.User.list();
						// console.log("[**AuthStore] Users response:", response);

						const { data: users } = await client.models.User.list({
							filter: { cognitoId: { eq: cognitoUser.userId } },
						});
						// console.log("[&&&AuthStore] Users:", response.data?.[4], users?.[0]);

						if (users?.[0]) {
							normalizedUser.id = users[0].id;
							normalizedUser.name = users[0].name;
							normalizedUser.phone = users[0].phone;
							normalizedUser.contactId = users[0].contactId;

							// Update last login
							await client.models.User.update({
								id: users[0].id,
								lastLogin: new Date().toISOString(),
							});
						}
					} catch (err) {
						console.warn("[AuthStore] Failed to fetch/update user data:", err);
					}

					set({
						user: normalizedUser,
						isAuthenticated: true,
						isAdmin: groups.includes("GOVLYNK_ADMIN"),
						isGovLynk: groups.some((g) => g.includes("GOVLYNK")),
						isGovLynkAdmin: groups.includes("GOVLYNK_ADMIN"),
						groups,
						authDetails: authInfo,
					});

					return normalizedUser;
				} catch (err) {
					console.error("[AuthStore] Failed to initialize authentication", err);
					set({
						error: "Failed to initialize authentication",
						isAuthenticated: false,
						user: null,
						groups: [],
						authDetails: null,
					});
				}
			},

			updateUserProfile: async (updates) => {
				const currentUser = get().user;
				if (!currentUser?.id) return;

				try {
					const { data: updatedUser } = await client.models.User.update({
						id: currentUser.id,
						...updates,
					});

					set((state) => ({
						user: {
							...state.user,
							...updatedUser,
						},
					}));

					return updatedUser;
				} catch (err) {
					throw new Error("Failed to update user profile");
				}
			},

			reset: () => {
				set({
					user: null,
					isAuthenticated: false,
					isAdmin: false,
					isGovLynk: false,
					isGovLynkAdmin: false,
					groups: [],
					authDetails: null,
				});
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				isAdmin: state.isAdmin,
				isGovLynk: state.false,
				isGovLynkAdmin: state.false,
				groups: state.groups,
				authDetails: state.authDetails,
			}),
		}
	)
);
