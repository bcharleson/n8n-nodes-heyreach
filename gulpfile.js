const { src, dest, parallel } = require('gulp');

function buildIconsFromIconsFolder() {
	return src('icons/**/*')
		.pipe(dest('dist/icons/'));
}

function buildIconsFromNodesFolder() {
	return src('nodes/**/*.svg')
		.pipe(dest('dist/nodes/'));
}

const buildIcons = parallel(buildIconsFromIconsFolder, buildIconsFromNodesFolder);

exports['build:icons'] = buildIcons;
