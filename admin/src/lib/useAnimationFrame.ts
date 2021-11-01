import React, { useEffect, useRef } from "react";

export type UseAnimationFrameCallback = ({
	totalMs,
	deltaMs,
}: {
	totalMs: number;
	deltaMs: number;
}) => void;

export function useAnimationFrame(
	cb: UseAnimationFrameCallback,
	deps?: React.DependencyList,
): void {
	if (typeof performance === "undefined" || typeof window === "undefined") {
		return;
	}

	const frame = useRef<number>();
	const last = useRef(performance.now());
	const init = useRef(performance.now());

	const animate = () => {
		const now = performance.now();
		const totalMs = now - init.current;
		const deltaMs = now - last.current;
		cb({ totalMs, deltaMs });
		last.current = now;
		frame.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		frame.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame.current!);
	}, deps);
}
