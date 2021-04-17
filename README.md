# bala.DualSelectList

bala.DualSelectList is a jQuery plugin to provid multiple-select function through 2 List-Boxes.

Demo page: 
1. Single Element: https://balachuang.github.io/DualSelectList/demo_1.html
1. Multiple Elements: https://balachuang.github.io/DualSelectList/demo_2.html


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

### 2021/04/04 - New Feature: 
#### Candidate / Selection items can be either pure String or Object with "value" property.
```sh
dsl.setCandidate(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05']);
dsl.setSelection(['Item 06', 'Item 07', 'Item 08', 'Item 09', 'Item 10']);
```
or
```sh
'candidateItems' : [{'id':0, 'value':'Item 01'},
                    {'id':1, 'value':'Item 02'},
                    {'id':2, 'value':'Item 03'},
                    {'id':3, 'value':'Item 04'},
                    {'id':4, 'value':'Item 05'} ],
'selectionItems' : [{'id':5, 'value':'Item 06'},
                    {'id':6, 'value':'Item 07'},
                    {'id':7, 'value':'Item 08'} ],
```
#### A new parameter for getSelection() to decide what data type will be returned. 
```sh
var res = dsl.getSelection(true);  // Get an Array of String only
var res = dsl.getSelection(false); // Get an Array of full Json Objects
```

>
> The jQuery Plugin Registry is now in read-only mode.
> https://plugins.jquery.com/
>
