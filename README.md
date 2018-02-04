# bala.DualSelectList

bala.DualSelectList is a jQuery plugin to provid multiple-select function through 2 List-Boxes.

# How to use:

### 1. Create DualSelectList with candidate items and default color
```sh
var dsl = $('#dualSelectExample').DualSelectList({
	'candidateItems' : ['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05', 'Item 06', 'Item 07'],
	'selectionItems' : ['Item 08', 'Item 09', 'Item 10'],
	'colors' : {
		'itemText' : 'white',
		'itemBackground' : 'rgb(0, 51, 204)',
		'itemHoverBackground' : '#0066ff'
	}
});
```

These strings can be used as color name:
| Color Name | Discription |
| ------ | ------ |
| panelBackground | Set / Reset the **background-color** feature of panel |
| filterText | Set / Reset the **color** feature of filter |
| itemText | Set / Reset the **color** feature of item |
| itemBackground | Set / Reset the **background-color** feature of item |
| itemHoverBackground | Set / Reset the **background-color** feature of item when mouse over |
| itemPlaceholderBackground | Set / Reset the **background-color** feature of item placeholder |
| itemPlaceholderBorder | Set / Reset the **border-color** feature of item placeholder |

### 2. Set candidate / selection items after DualSelectList created
```sh
var dsl = $('#dualSelectExample').DualSelectList();
dsl.setCandidate(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05']);
dsl.setSelection(['Item 06', 'Item 07', 'Item 08', 'Item 09', 'Item 10']);
```

### 3. Set / Reset item color after DualSelectList created
```sh
var dsl = $('#dualSelectExample').DualSelectList();
dsl.setColor('panelBackground', 'yellow');
dsl.resetColor('panelBackground');
```

The color names list in (1) can be used as the first parameter.
Using resetColor('') to reset all color.

### 4. Get select result
```sh
var res = dsl.getSelection();
```

>
> The jQuery Plugin Registry is now in read-only mode.
> https://plugins.jquery.com/
>
