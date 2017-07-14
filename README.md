bala.DualSelectList
============

bala.DualSelectList is a jQuery plugin to provid multiple-select function through 2 List-Boxes.

How to use:

1. Create DualSelectList with candidate items

var dsl = $('#dualSelectExample').DualSelectList({
	'candidateItems' : ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05', 'Item 06', 'Item 07'],
	'selectionItems' : ['Item 08', 'Item 09', 'Item 10']
});

2. Set candidate / selection items after DualSelectList created

var dsl = $('#dualSelectExample').DualSelectList();
dsl.setCandidate(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05']);
dsl.setSelection(['Item 06', 'Item 07', 'Item 08', 'Item 09', 'Item 10']);

3. Get select result

var res = dsl.getSelection();


* The jQuery Plugin Registry is now in read-only mode.
https://plugins.jquery.com/
