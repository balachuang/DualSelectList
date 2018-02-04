bala.DualSelectList
============

bala.DualSelectList is a jQuery plugin to provid multiple-select function through 2 List-Boxes.

How to use:

1. Create DualSelectList with candidate items and default color

	var dsl = $('#dualSelectExample').DualSelectList({
		'candidateItems' : ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05', 'Item 06', 'Item 07'],
		'selectionItems' : ['Item 08', 'Item 09', 'Item 10'],
		'colors' : {
			'itemText' : 'white',
			'itemBackground' : 'rgb(0, 51, 204)',
			'itemHoverBackground' : '#0066ff'
		}
	});

	These strings can be used as color name:

		panelBackground
		filterText
		itemText
		itemBackground
		itemHoverBackground
		itemPlaceholderBackground
		itemPlaceholderBorder
	
2. Set candidate / selection items after DualSelectList created

	var dsl = $('#dualSelectExample').DualSelectList();
	dsl.setCandidate(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05']);
	dsl.setSelection(['Item 06', 'Item 07', 'Item 08', 'Item 09', 'Item 10']);

3. Set / Reset item color after DualSelectList created

	var dsl = $('#dualSelectExample').DualSelectList();
	dsl.setColor('panelBackground', 'yellow');
	dsl.resetColor('panelBackground');

	The color names list in (1) can be used as the first parameter.
	Using resetColor('') to reset all color.

4. Get select result

	var res = dsl.getSelection();


* The jQuery Plugin Registry is now in read-only mode.
https://plugins.jquery.com/
