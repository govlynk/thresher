import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { format, startOfWeek, endOfWeek, addWeeks, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { useGlobalStore } from "./globalStore";
import { SPRINT_CONFIG, TASK_STATUS } from "../config/taskConfig";

const client = generateClient();

const generateSprintName = (startDate, index) => {
	return `Sprint ${index + 1} (${format(new Date(startDate), "MMM d, yyyy")})`;
};

const getFirstMondayOfYear = () => {
	const year = SPRINT_CONFIG.year;
	const firstDay = startOfYear(new Date(year, 0, 1));
	return startOfWeek(firstDay, { weekStartsOn: 1 });
};

const getLastSundayOfYear = () => {
	const year = SPRINT_CONFIG.year;
	const lastDay = endOfYear(new Date(year, 11, 31));
	return endOfWeek(lastDay, { weekStartsOn: 1 });
};

export const useSprintStore = create((set, get) => ({
	sprints: [],
	activeSprint: null,
	loading: false,
	error: null,
	sprintDuration: SPRINT_CONFIG.defaultDuration, // Duration in weeks

	fetchSprints: async (teamId) => {
		if (!teamId) {
			set({
				sprints: [],
				activeSprint: null,
				loading: false,
				error: null,
			});
			return;
		}

		set({ loading: true });
		try {
			// Fetch all sprints using pagination
			let allSprints = [];
			let nextToken = null;

			do {
				const response = await client.models.Sprint.list({
					filter: { teamId: { eq: teamId } },
					limit: 1000,
					nextToken,
				});

				allSprints = [...allSprints, ...response.data];
				nextToken = response.nextToken;
			} while (nextToken);

			console.log("Fetched all sprints:", allSprints.length);

			// Sort sprints by start date
			const sortedSprints = allSprints.sort((a, b) => {
				const dateA = new Date(a.startDate).getTime();
				const dateB = new Date(b.startDate).getTime();
				return dateA - dateB;
			});

			console.log("Sorted sprints:", sortedSprints);

			// Find active sprint
			const now = new Date();
			let activeSprintData = sortedSprints.find((sprint) => {
				const startDate = new Date(sprint.startDate);
				const endDate = new Date(sprint.endDate);
				return now >= startDate && now <= endDate;
			});

			// If no active sprint found, find the next upcoming sprint
			if (!activeSprintData && sortedSprints.length > 0) {
				activeSprintData = sortedSprints.find((sprint) => {
					const startDate = new Date(sprint.startDate);
					return startDate > now;
				});

				// If no upcoming sprint, use the last sprint
				if (!activeSprintData) {
					activeSprintData = sortedSprints[sortedSprints.length - 1];
				}
			}

			// Update sprint statuses based on dates
			const updatedSprints = sortedSprints.map((sprint, index) => {
				const startDate = new Date(sprint.startDate);
				const endDate = new Date(sprint.endDate);
				let status;

				if (now < startDate) {
					status = "planning";
				} else if (now > endDate) {
					status = "completed";
				} else {
					status = "active";
				}

				// Only update if status has changed
				if (sprint.status !== status) {
					client.models.Sprint.update({
						id: sprint.id,
						status,
						position: index, // Update position to match sorted order
					}).catch((err) => console.error("Error updating sprint status:", err));
				}

				return {
					...sprint,
					status,
				};
			});

			set({
				sprints: updatedSprints,
				activeSprint: activeSprintData || null,
				loading: false,
				error: null,
			});
		} catch (err) {
			console.error("Error fetching sprints:", err);
			set({
				error: err.message,
				loading: false,
			});
		}
	},

	generateSprints: async (teamId) => {
		if (!teamId) {
			throw new Error("Team ID is required to generate sprints");
		}

		set({ loading: true });
		try {
			const sprintDurationWeeks = get().sprintDuration;
			const startDate = getFirstMondayOfYear();
			const endDate = getLastSundayOfYear();

			const newSprints = [];
			let currentDate = new Date(startDate);
			let index = 0;

			while (isWithinInterval(currentDate, { start: startDate, end: endDate })) {
				const sprintStart = new Date(currentDate);
				const sprintEnd = endOfWeek(addWeeks(sprintStart, sprintDurationWeeks - 1), { weekStartsOn: 1 });

				// Break if sprint would extend beyond the year
				if (sprintEnd.getFullYear() > SPRINT_CONFIG.year) {
					break;
				}

				// Check if sprint already exists for this team and start date
				const existingSprints = await client.models.Sprint.list({
					filter: {
						and: [{ teamId: { eq: teamId } }, { startDate: { eq: sprintStart.toISOString() } }],
					},
				});

				// Skip if sprint already exists
				if (existingSprints.data?.length > 0) {
					currentDate = addWeeks(currentDate, sprintDurationWeeks);
					index++;
					continue;
				}

				const sprintData = {
					name: generateSprintName(sprintStart, index),
					goal: `Sprint ${index + 1} Goals`,
					startDate: sprintStart.toISOString(),
					endDate: sprintEnd.toISOString(),
					status: "planning", // Status will be updated based on dates in fetchSprints
					position: index,
					teamId: teamId,
				};

				// Create sprint in database
				const response = await client.models.Sprint.create(sprintData);
				newSprints.push(response.data);

				// Move to next sprint period
				currentDate = addWeeks(currentDate, sprintDurationWeeks);
				index++;
			}

			// Sort new sprints before adding them
			const sortedNewSprints = newSprints.sort((a, b) => {
				const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
				const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
				return dateA.getTime() - dateB.getTime();
			});

			// Update store state with new sprints
			set((state) => ({
				sprints: [...state.sprints, ...sortedNewSprints],
				activeSprint: sortedNewSprints[0], // Set first sprint as active
				loading: false,
				error: null,
			}));

			return newSprints;
		} catch (err) {
			console.error("Error generating sprints:", err);
			set({
				error: err.message || "Failed to generate sprints",
				loading: false,
			});
			throw err;
		}
	},

	createSprint: async (sprintData) => {
		set({ loading: true });
		try {
			const { activeTeamId } = useGlobalStore.getState();
			if (!activeTeamId) {
				throw new Error("Please select a specific team");
			}

			// Ensure dates are in ISO string format
			const formattedData = {
				...sprintData,
				startDate: new Date(sprintData.startDate).toISOString(),
				endDate: new Date(sprintData.endDate).toISOString(),
				teamId: activeTeamId,
			};

			const response = await client.models.Sprint.create(formattedData);

			set((state) => ({
				sprints: [...state.sprints, response.data],
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error creating sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	updateSprint: async (id, updates) => {
		set({ loading: true });
		try {
			// Ensure dates are in ISO string format
			const formattedUpdates = {
				...updates,
				startDate: new Date(updates.startDate).toISOString(),
				endDate: new Date(updates.endDate).toISOString(),
			};

			// Only include fields that are actually defined in the schema
			const validFields = ["name", "goal", "startDate", "endDate", "status", "position", "teamId"];

			const filteredUpdates = Object.keys(formattedUpdates)
				.filter((key) => validFields.includes(key))
				.reduce((obj, key) => {
					obj[key] = formattedUpdates[key];
					return obj;
				}, {});

			const response = await client.models.Sprint.update({
				id,
				...filteredUpdates,
			});

			set((state) => ({
				sprints: state.sprints.map((sprint) => (sprint.id === id ? response.data : sprint)),
				loading: false,
				error: null,
			}));

			return response.data;
		} catch (err) {
			console.error("Error updating sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	setActiveSprint: (sprintId) => {
		const sprint = get().sprints.find((s) => s.id === sprintId);
		set({ activeSprint: sprint });
	},

	addTaskToSprint: async (sprintId, taskId) => {
		set({ loading: true });
		try {
			const response = await client.models.Todo.update({
				id: taskId,
				sprintId,
			});

			set({ loading: false, error: null });
			return response.data;
		} catch (err) {
			console.error("Error adding task to sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	moveTaskBetweenSprints: async (taskId, fromSprintId, toSprintId) => {
		set({ loading: true });
		try {
			const response = await client.models.Todo.update({
				id: taskId,
				sprintId: toSprintId,
			});

			set({ loading: false, error: null });
			return response.data;
		} catch (err) {
			console.error("Error moving task between sprints:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	completeSprint: async (sprintId) => {
		set({ loading: true });
		try {
			// Update sprint status
			await client.models.Sprint.update({
				id: sprintId,
				status: "COMPLETED",
			});

			// Move incomplete tasks to backlog
			const tasks = await client.models.Todo.list({
				filter: {
					and: [{ sprintId: { eq: sprintId } }, { status: { ne: TASK_STATUS.DONE } }],
				},
			});

			await Promise.all(
				tasks.data.map((task) =>
					client.models.Todo.update({
						id: task.id,
						sprintId: null,
						status: TASK_STATUS.TODO,
					})
				)
			);

			set((state) => ({
				sprints: state.sprints.map((sprint) =>
					sprint.id === sprintId ? { ...sprint, status: "COMPLETED" } : sprint
				),
				loading: false,
				error: null,
			}));
		} catch (err) {
			console.error("Error completing sprint:", err);
			set({
				error: err.message,
				loading: false,
			});
			throw err;
		}
	},

	cleanup: () => {
		set({
			sprints: [],
			activeSprint: null,
			loading: false,
			error: null,
		});
	},
}));
