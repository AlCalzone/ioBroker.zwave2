import * as React from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
// wotan-disable no-misused-generics

export function useStateWithRef<S = undefined>(): [
	S | undefined,
	MutableRefObject<S | undefined>,
	Dispatch<SetStateAction<S | undefined>>,
];
export function useStateWithRef<S>(
	initialState: S | (() => S),
): [S, MutableRefObject<typeof initialState>, Dispatch<SetStateAction<S>>];

export function useStateWithRef<S>(
	initialState?: S | (() => S),
): [S, MutableRefObject<typeof initialState>, Dispatch<SetStateAction<S>>] {
	// Create the state as usual
	const [state, setState] = React.useState(initialState);
	// Create a ref that points to the current state
	const stateRef = React.useRef(initialState);
	// And update it whenever state changes
	React.useEffect(() => {
		stateRef.current = state;
	}, [state]);
	return [state as any, stateRef, setState as any];
}
