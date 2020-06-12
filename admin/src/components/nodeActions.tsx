import * as React from "react";

export interface NodeActionsProps {
	nodeId: number;
	status: string | undefined;
	actions: {
		remove: () => Promise<void>;
		refreshInfo: () => Promise<void>;
	};
	close: () => void;
}

export function NodeActions(props: NodeActionsProps) {
	const [isBusy, setBusy] = React.useState(false);

	async function removeNode() {
		setBusy(true);
		try {
			await props.actions.remove();
			props.close();
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	async function refreshInfo() {
		setBusy(true);
		try {
			await props.actions.refreshInfo();
			props.close();
		} catch (e) {
			alert(e);
		} finally {
			setBusy(false);
		}
	}

	const isNodeFailed = props.status === "dead" || props.status === "asleep";

	return (
		<>
			<h5>{_("Modal_Actions")}</h5>
			<div
				className="container"
				style={{ marginLeft: 0, marginRight: 0 }}
			>
				{/* Buttons to remove failed nodes - only show them if the node may be failed */}
				<div className="row">
					<div className="col s12">
						<a
							className={`btn red ${
								!isNodeFailed || isBusy ? "disabled" : ""
							}`}
							title={
								isNodeFailed
									? undefined
									: _("This is not a failed node")
							}
							onClick={() => removeNode()}
						>
							{_("Remove failed node")}
						</a>
					</div>
				</div>
				{/* Buttons to re-interview a node */}
				<div className="row">
					<div className="col s12">
						<a
							className={`btn ${isBusy ? "disabled" : ""}`}
							onClick={() => refreshInfo()}
						>
							{_("Refresh node info")}
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
