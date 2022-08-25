import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";

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
	const [state, setState] = useState(initialState);
	// Create a ref that points to the current state
	const stateRef = useRef(initialState);
	// And update it whenever state changes
	useEffect(() => {
		stateRef.current = state;
	}, [state]);
	return [state as any, stateRef, setState as any];
}
