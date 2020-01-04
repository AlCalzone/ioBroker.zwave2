import * as React from "react";

export interface ModalProps {
	id?: string;
	title: string;
	content: string | React.ReactNode;
	yesButtonText?: string;
	noButtonText?: string;
	hasNoButton?: boolean;
	onClose?(result: boolean): void;
	open: boolean;
	fixedFooter?: boolean;
}

export function Modal(props: ModalProps) {
	const [instance, setInstance] = React.useState<M.Modal>();

	const getModalRef = React.useCallback(node => {
		if (node) {
			setInstance(M.Modal.init(node));
		}
	}, []);

	React.useEffect(() => {
		if (instance) {
			if (props.open && !instance.isOpen) {
				instance.open();
			} else if (!props.open && instance.isOpen) {
				instance.close();
			}
		}
	}, [props.open]);

	return (
		<div
			id={props.id}
			ref={getModalRef}
			className={`modal ${props.fixedFooter ? "modal-fixed-footer" : ""}`}
		>
			<div className="modal-content">
				<h4>{props.title}</h4>
				<p>{props.content}</p>
			</div>
			<div className="modal-footer">
				<a
					className="modal-close waves-effect waves-green btn-flat"
					onClick={() => props.onClose?.(true)}
				>
					{props.yesButtonText ?? "OK"}
				</a>
				{props.hasNoButton && (
					<a
						className="modal-close waves-effect waves-green btn-flat"
						onClick={() => props.onClose?.(false)}
					>
						{props.noButtonText ?? "Cancel"}
					</a>
				)}
			</div>
		</div>
	);
}
