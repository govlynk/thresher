import { create } from 'zustand';
import { addWeeks, startOfWeek, format, startOfYear, isBefore } from 'date-fns';

const generateSprintName = (startDate, index) => {
  return `Sprint ${index + 1} (${format(startDate, 'MMM d, yyyy')})`;
};

export const useKanbanStore = create((set) => ({
  todos: [],
  sprints: [],
  teams: [],
  currentSprintId: null,
  activeId: null,
  columnLimits: {
    todo: 10,
    doing: 5,
    done: Infinity,
  },
  setActiveId: (id) =>
    set({ activeId: id }),
  setCurrentSprint: (sprintId) =>
    set({ currentSprintId: sprintId }),
  setColumnLimit: (status, limit) =>
    set((state) => ({
      columnLimits: { ...state.columnLimits, [status]: limit },
    })),
  updateSprint: (sprintId, updates) =>
    set((state) => ({
      sprints: state.sprints.map((sprint) =>
        sprint.id === sprintId ? { ...sprint, ...updates } : sprint
      ),
    })),
  moveTodo: (todoId, newStatus, newPosition) =>
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
    }),
  addTodo: (todo) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          ...todo,
          id: Math.random().toString(36).substr(2, 9),
          position: state.todos.filter((t) => t.status === todo.status).length,
        },
      ],
    })),
  updateTodo: (todoId, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, ...updates } : todo
      ),
    })),
  generateSprints: (startDate, count) =>
    set((state) => {
      const newSprints = [];
      let currentDate = startOfWeek(startOfYear(startDate), { weekStartsOn: 1 });
      const currentYear = startDate.getFullYear();
      const maxSprints = 18; // 9 months of 2-week sprints

      // Find active sprint based on current date
      const now = new Date();
      let activeSprintIndex = -1;

      for (let i = 0; i < Math.min(count, maxSprints); i++) {
        const sprintStart = currentDate;
        const sprintEnd = addWeeks(currentDate, 2);

        if (now >= sprintStart && now < sprintEnd) {
          activeSprintIndex = i;
        }

        // Determine sprint status
        let status;
        if (isBefore(sprintEnd, now)) {
          status = 'completed';
        } else if (now >= sprintStart && now < sprintEnd) {
          status = 'active';
        } else {
          status = 'planning';
        }

        const sprint = {
          id: Math.random().toString(36).substr(2, 9),
          name: generateSprintName(currentDate, i),
          year: currentYear,
          goal: `Sprint ${i + 1} Goals`,
          startDate: sprintStart.toISOString(),
          endDate: sprintEnd.toISOString(),
          status,
          position: i,
          teamId: '1',
        };
        newSprints.push(sprint);
        currentDate = addWeeks(currentDate, 2);
      }

      const activeSprintId = activeSprintIndex >= 0 ? newSprints[activeSprintIndex].id : null;
      return {
        sprints: [...state.sprints, ...newSprints],
        currentSprintId: activeSprintId,
      };
    }),
}));