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

					// Extract groups from Cognito token
					const groups = cognitoUser.signInUserSession?.accessToken?.payload?.["cognito:groups"] || [];
					const isAdmin = groups.some((group) => typeof group === "string" && group.toLowerCase() === "admin");
					const isGovLynk = groups.some(
						(group) => typeof group === "string" && group.toLowerCase().includes === "govlynk"
					);
					const isGovLynkAdmin = groups.some(
						(group) => typeof group === "string" && group.toLowerCase() === "govlynk_admin"
					);
					console.log("authInfo", authInfo);
					// Fetch user data from database using email
					const { data: users } = await client.models.User.list({
						filter: { email: { eq: authInfo.email } },
						limit: 1,
					});
					console.log("users", users?.[0]);
					let userData = users?.[0];

					if (!userData) {
						//throw new Error("User is not defined");
						// Create new user if doesn't exist
						// const { data: newUser } = await client.models.User.create({
						// 	cognitoId: cognitoUser.userId,
						// 	email: authInfo.email,
						// 	name: cognitoUser.username,
						// 	status: "ACTIVE",
						// 	lastLogin: new Date().toISOString(),
						// });
						// userData = newUser;
					} else {
						// Update last login
						const { data: updatedUser } = await client.models.User.update({
							id: userData.id,
							lastLogin: new Date().toISOString(),
						});
						userData = updatedUser;
					}

					// Fetch user's company associations
					const { data: UserCompanyAccesss } = await client.models.UserCompanyAccess.list({
						filter: { userId: { eq: userData.id } },
						include: {
							company: true,
						},
					});

					// Create normalized user object
					const normalizedUser = {
						...userData,
						...authInfo,
						groups,
						companies:
							UserCompanyAccesss?.map((ucr) => ({
								...ucr.company,
								access: ucr.access,
								UserCompanyAccessId: ucr.id,
								status: ucr.status,
							})) || [],
						signInUserSession: cognitoUser.signInUserSession,
					};

					set({
						user: normalizedUser,
						isAuthenticated: true,
						isAdmin,
						isGovLynk,
						isGovLynkAdmin,
						groups,
						authDetails: authInfo,
					});

					return normalizedUser;
				} catch (err) {
					set({
						error: "Failed to initialize authentication",
						isAuthenticated: false,
						user: null,
						groups: [],
						authDetails: null,
					});
					throw err;
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
