

// Adds an Afflictions submenu button to the Token Controls menu in Foundry VTT v12
Hooks.on('getSceneControlButtons', controls => {
	const tokenControls = controls.find(c => c.name === 'token');
	if (!tokenControls) return;
	tokenControls.tools.push({
		name: 'afflictions',
		title: 'Afflictions',
		icon: 'fas fa-biohazard',
		visible: true,
			onClick: () => {
				new window.AfflictionsWindow().render(true);
			},
		button: true
	});
});

