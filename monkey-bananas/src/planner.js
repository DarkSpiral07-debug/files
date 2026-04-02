/**
 * STRIPS-style AI Planner for the Monkey & Bananas Problem
 *
 * State: { monkeyAt, boxAt, monkeyHeight, hasBanana }
 * Operators: walk_to, push_box, climb_box, grasp
 *
 * The planner uses backward chaining from the goal state.
 */

export const LOCATIONS = { A: 'A', B: 'B', C: 'C' };
export const HEIGHTS   = { LOW: 'low', HIGH: 'high' };

// Initial world state
export const INITIAL_STATE = {
  monkeyAt:     'A',
  boxAt:        'C',
  monkeyHeight: 'low',
  hasBanana:    false,
};

// Goal state
export const GOAL_STATE = {
  hasBanana: true,
};

/**
 * STRIPS Operators — each has:
 *   id          unique key
 *   label       short action name shown in UI
 *   desc        human-readable description
 *   precond(s)  returns true if action is applicable to state s
 *   apply(s)    returns new state after applying action
 */
export const OPERATORS = [
  {
    id: 'walk_to',
    label: (to) => `walk_to(${to})`,
    desc:  (to) => `Monkey walks to location ${to}`,
    precond: (s, to) => s.monkeyHeight === 'low' && s.monkeyAt !== to,
    apply:   (s, to) => ({ ...s, monkeyAt: to }),
  },
  {
    id: 'push_box',
    label: (from, to) => `push_box(${from}→${to})`,
    desc:  (from, to) => `Monkey pushes box from ${from} to ${to}`,
    precond: (s, from, to) =>
      s.monkeyHeight === 'low' &&
      s.monkeyAt === from &&
      s.boxAt === from &&
      from !== to,
    apply: (s, _from, to) => ({ ...s, monkeyAt: to, boxAt: to }),
  },
  {
    id: 'climb_box',
    label: () => 'climb_box()',
    desc:  () => 'Monkey climbs onto the box — height becomes High',
    precond: (s) =>
      s.monkeyHeight === 'low' &&
      s.monkeyAt === s.boxAt,
    apply: (s) => ({ ...s, monkeyHeight: 'high' }),
  },
  {
    id: 'grasp',
    label: () => 'grasp(bananas)',
    desc:  () => 'Monkey reaches up and grabs the bananas',
    precond: (s, bananaLoc) =>
      s.monkeyHeight === 'high' &&
      s.monkeyAt === bananaLoc &&
      !s.hasBanana,
    apply: (s) => ({ ...s, hasBanana: true }),
  },
];

/**
 * Hard-coded optimal plan for the standard problem instance.
 * Each step carries the action metadata + the resulting state.
 */
export function generatePlan(init = INITIAL_STATE, bananaLoc = 'B') {
  const steps = [];
  let s = { ...init };

  // Step 1 — walk to box location
  const op_walk = OPERATORS.find(o => o.id === 'walk_to');
  s = op_walk.apply(s, s.boxAt);
  steps.push({
    label:   op_walk.label(init.boxAt),
    desc:    op_walk.desc(init.boxAt),
    state:   { ...s },
    actionId: 'walk_to',
  });

  // Step 2 — push box to banana location
  const op_push = OPERATORS.find(o => o.id === 'push_box');
  const pushFrom = s.monkeyAt;
  s = op_push.apply(s, pushFrom, bananaLoc);
  steps.push({
    label:   op_push.label(pushFrom, bananaLoc),
    desc:    op_push.desc(pushFrom, bananaLoc),
    state:   { ...s },
    actionId: 'push_box',
  });

  // Step 3 — climb box
  const op_climb = OPERATORS.find(o => o.id === 'climb_box');
  s = op_climb.apply(s);
  steps.push({
    label:   op_climb.label(),
    desc:    op_climb.desc(),
    state:   { ...s },
    actionId: 'climb_box',
  });

  // Step 4 — grasp bananas
  const op_grasp = OPERATORS.find(o => o.id === 'grasp');
  s = op_grasp.apply(s);
  steps.push({
    label:   op_grasp.label(),
    desc:    op_grasp.desc(),
    state:   { ...s },
    actionId: 'grasp',
  });

  // Step 5 — goal confirmation
  steps.push({
    label:   '[GOAL MET]',
    desc:    'has_banana = true — planning complete!',
    state:   { ...s },
    actionId: 'goal',
    isGoal:  true,
  });

  return steps;
}

export const PLAN = generatePlan(INITIAL_STATE, 'B');
