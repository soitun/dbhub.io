import React from "react";
import ReactDOM from "react-dom/client";

import ModalImage from "react-modal-image";

import Auth from "./auth";
import BranchesTable from "./branches";
import DatabaseCommits from "./database-commits";
import DatabaseSettings from "./database-settings";
import DatabaseTags from "./database-tags";
import DatabaseView from "./database-view";
import DatabaseWatchers from "./database-watchers";
import DbHeader from "./db-header";
import DiscussionList from "./discussion-list";
import MarkdownEditor from "./markdown-editor";

{
	const rootNode = document.getElementById("db-header-root");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<DbHeader />);
	}
}

{
	const rootNode = document.getElementById("authcontrol");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<Auth />);
	}
}

{
	const rootNode = document.getElementById("branches");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<BranchesTable />);
	}
}

{
	const rootNode = document.getElementById("database-commits");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<DatabaseCommits />);
	}
}

{
	const rootNode = document.getElementById("database-settings");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<DatabaseSettings />);
	}
}

{
	const rootNode = document.getElementById("database-tags");
	if (rootNode) {
		const releases = rootNode.dataset.releases;

		const root = ReactDOM.createRoot(rootNode);
		root.render(<DatabaseTags releases={releases} />);
	}
}

{
	const rootNode = document.getElementById("database-view");
	if (rootNode) {
		const root = ReactDOM.createRoot(rootNode);
		root.render(<DatabaseView />);
	}
}

{
	const rootNode = document.getElementById("database-watchers");
	if (rootNode) {
		const stars = rootNode.dataset.stars;

		const root = ReactDOM.createRoot(rootNode);
		root.render(<DatabaseWatchers stars={stars} />);
	}
}

{
	const rootNode = document.getElementById("discussion-list");
	if (rootNode) {
		const mergeRequests = rootNode.dataset.mergeRequests;

		const root = ReactDOM.createRoot(rootNode);
		root.render(<DiscussionList mergeRequests={mergeRequests} />);
	}
}

{
	document.querySelectorAll(".markdown-editor").forEach((rootNode) => {
		const editorId = rootNode.dataset.id;
		const rows = rootNode.dataset.rows;
		const placeholder = rootNode.dataset.placeholder;
		const defaultIndex = rootNode.dataset.defaultIndex;
		const initialValue = rootNode.dataset.initialValue;
		const viewOnly = rootNode.dataset.viewOnly;

		const root = ReactDOM.createRoot(rootNode);
		root.render(<MarkdownEditor
			editorId={editorId}
			rows={rows}
			placeholder={placeholder}
			defaultIndex={defaultIndex}
			initialValue={initialValue}
			viewOnly={viewOnly}
		/>);
	});
}

{
	document.querySelectorAll(".lightbox-image").forEach((rootNode) => {
		const small = rootNode.dataset.small;
		const large = rootNode.dataset.large;
		const alt = rootNode.dataset.alt;

		const root = ReactDOM.createRoot(rootNode);
		root.render(<ModalImage
			small={small}
			large={large}
			alt={alt}
		/>);
	});

}
