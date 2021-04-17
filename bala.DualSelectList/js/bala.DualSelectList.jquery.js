/**
 * 2021/04/03 - Turn the input data from String to JsonObject
 */

(function($) {

	$.fn.DualSelectList = function(parameter)
	{
		// Only allow DIV to be the DualSelectList container
		if (this.length != 1) return;
		if (this.prop('tagName') != 'DIV') return;

		// constance
		const CONST_LEFT  = 1;
		const CONST_RIGHT = 2;
		const CONST_BOTH  = 3;
		const CONST_FILTER_PLACEHOLDER = 'Input Filter';

		// Apply default value
		var params = $.extend({}, $.fn.DualSelectList.defaults, parameter);

		var thisMain = null;
		var thisMainID = '';
		var thisPanel = {left: null, right: null};
		var thisInput = {left: null, right: null};
		var thisMover = {left: null, right: null};
		var thisItemNull = null;

		var thisSelect = null;
		var srcEvent = null;
		var isPickup = false;
		var isMoving = false;
		var xOffset = null;
		var yOffset = null;

		var thisCandidateItems = new Array();
		var thisSelectionItems = new Array();


		this.init = function () {

			// add ID to this DIV
			thisMain = this;
			thisMainID = '_dsl_' + (new Date).getTime();
			thisMain.attr('id', thisMainID);

			// Initialize DualSelectList content
			this.append(
				'<div class="dsl-filter left-panel" >' +
				'	<input class="dsl-filter-input" tyle="text" value="' + CONST_FILTER_PLACEHOLDER + '" />' +
				'	<div class="dsl-filter-move-all left-panel">&#x25B6;</div></div>' +
				'<div class="dsl-filter right-panel">' +
				'	<input class="dsl-filter-input" tyle="text" value="' + CONST_FILTER_PLACEHOLDER + '" />' +
				'	<div class="dsl-filter-move-all right-panel">&#x25C0;</div></div>' +
				'<div class="dsl-panel left-panel"  />' +
				'<div class="dsl-panel right-panel" />' +
				'<div class="dsl-panel-item-null">&nbsp;</div>'
			);

			thisPanel.left  = this.find('div.dsl-panel.left-panel').eq(0);
			thisPanel.right = this.find('div.dsl-panel.right-panel').eq(0);
			thisInput.left  = this.find('div.dsl-filter.left-panel').find('input.dsl-filter-input').eq(0);
			thisInput.right = this.find('div.dsl-filter.right-panel').find('input.dsl-filter-input').eq(0);
			thisMover.left  = this.find('div.dsl-filter-move-all.left-panel').eq(0);
			thisMover.right = this.find('div.dsl-filter-move-all.right-panel').eq(0);
			thisItemNull = this.find('div.dsl-panel-item-null');

			// append color css
			appendColorStyle();

			// Allow default Candidate and default Selection
			// turn pure String input to JSON Object
			if(typeof(params.candidateItems) !== 'object') params.candidateItems = [{value : params.candidateItems}];
			if(typeof(params.selectionItems) !== 'object') params.selectionItems = [{value : params.selectionItems}];
			if (params.candidateItems.length > 0) this.setCandidate(params.candidateItems);
			if (params.selectionItems.length > 0) this.setSelection(params.selectionItems);

			// initial hiding Move All Icon
			toggleMoveAllIcon(CONST_BOTH);
			toggleItemDisplay(CONST_BOTH);

			// When mouse click down in one item, record this item for following actions.
			$(document).on('mousedown', '#' + thisMainID + ' div.dsl-panel-item', function(event) {
				// stop all item animation, to avoid 2 items append to the same item
				thisMain.find('div.dsl-panel-item:animated').stop(false, true);

				// if click on animating object, just skip.
				thisSelect = $(this);
				//if (thisSelect.is(':animated')) return;

				isPickup = true;
				srcEvent = event;
				event.preventDefault();
			});

			// When mouse move in [Body] ...
			// --> If already click down in one item, drag this item.
			// --> If no item is clicked, do nothing
			$(document).on('mousemove', 'body', function(event) {
				// move this item...
				if (isPickup) {
					if (isMoving) {
						thisSelect.css({
							'left' : event.screenX + xOffset,
							'top'  : event.screenY + yOffset
						});

						var target = findItemLocation(thisSelect);
						if (target.targetFirstPosition) {
							thisItemNull.prependTo(target.targetPanel).show();
						}else if (target.targetItem == null) {
							thisItemNull.appendTo(target.targetPanel).show();
						}else{
							thisItemNull.insertAfter(target.targetItem).show();
						}
					}else{
						if ((Math.abs(event.screenX - srcEvent.screenX) >= 2) ||
							(Math.abs(event.screenY - srcEvent.screenY) >= 2))
						{
							isMoving = true;

							var srcPanel = thisSelect.parent('div.dsl-panel');
							var xSrc = thisSelect.position().left;
							var ySrc = thisSelect.position().top;
							xOffset = xSrc - event.screenX;
							yOffset = ySrc - event.screenY;
							thisSelect.css({
								'position' : 'absolute',
								'z-index' : 10,
								'left' : xSrc,
								'top' : ySrc,
								'width' : srcPanel.width()
							}).appendTo(thisMain);
						}
					}
				}

				event.preventDefault();
			});

			// When mouse up ...
			// --> If there is an item clicked down ...
			// -----> If this item is draged with mouse, drop this item in correct location.
			// -----> If this item is not draged, calculate it's new location and fly to.
			// --> If there is no item clicked down, do nothing.
			$(document).on('mouseup', '#' + thisMainID + ' div.dsl-panel-item', function(event) {
				// Click on an item
				if (isPickup && !isMoving) {
					// fly to another panel
					var srcPanel = thisSelect.parent('div.dsl-panel');
					var tarPanel = srcPanel.siblings('div.dsl-panel');
					var tarItem = tarPanel.find('div.dsl-panel-item:visible:last');
					//var tarPanelConst = tarPanel.hasClass('left-panel') ? CONST_LEFT : CONST_RIGHT;

					var xSrc = thisSelect.position().left;
					var ySrc = thisSelect.position().top;
					var xTar = 0;
					var yTar = 0; 
					if (tarItem.length > 0) {
						xTar = tarItem.position().left;
						yTar = tarItem.position().top + tarItem.height();
						yTar = Math.min(yTar, tarPanel.position().top + tarPanel.width());
					}else{
						xTar = tarPanel.position().left;
						yTar = tarPanel.position().top; 
					}

					thisSelect.css({
						'pointer-events' : 'none',
						'position' : 'absolute',
						'z-index' : 10,
						'left' : xSrc,
						'top' : ySrc,
						'width' : srcPanel.width()
					}).animate({
						left: xTar,
						top: yTar
					},200, function(){
						thisSelect.css({
							'pointer-events' : 'initial',
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).appendTo(tarPanel);

						// update Move All Icon
						//animatingItems.remove(thisSelect);
						toggleMoveAllIcon(CONST_BOTH);
						toggleItemDisplay(CONST_BOTH);
					});
				}

				// Drag-n-Drop an item
				if (isPickup && isMoving) {
					// drag-n-drop item
					var target = findItemLocation($(this));
					if (target.targetFirstPosition) {
						thisSelect.css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).prependTo(target.targetPanel);
					}else if (target.targetItem == null) {
						thisSelect.css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).appendTo(target.targetPanel);
					}else{
						thisSelect.css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).insertAfter(target.targetItem);
					}

					// update Move All Icon
					toggleMoveAllIcon(CONST_BOTH);
					toggleItemDisplay(CONST_BOTH);
				}

				// reset the status
				isPickup = false;
				isMoving = false;
				thisItemNull.appendTo(thisMain).hide();
			});

			// Hotfix bug where sometimes the item won't drop and will stick to the mouse
			// When isPickup && isMoving && escape is pressed, drop the item in the nearest panel
			$(document).on('keyup', function(event) {
				if(isPickup && isMoving && event.keyCode === 27) {
					var target = findItemLocation(thisSelect);
					if (target.targetFirstPosition) {
						thisSelect.css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).prependTo(target.targetPanel);
					}else if (target.targetItem == null) {
                        thisSelect.css({
                            'position': 'initial',
                            'z-index': 'initial',
                            'width': 'calc(100% - 16px)'
                        }).appendTo(target.targetPanel);
				    } else {
                        thisSelect.css({
                            'position': 'initial',
                            'z-index': 'initial',
                            'width': 'calc(100% - 16px)'
                        }).insertAfter(target.targetItem);
				    }

					// update Move All Icon
					toggleMoveAllIcon(CONST_BOTH);

				    isPickup = false;
				    isMoving = false;
				    thisItemNull.appendTo(thisMain).hide();
				}
			});
			
			// When Clicking on the filter, remove the hint text
			// why not using "Place holder" feature of Input element??
			$(document).on('focus', '#' + thisMainID + ' input.dsl-filter-input', function() {
				var fltText = $(this).val();
				if (fltText == CONST_FILTER_PLACEHOLDER) {
					$(this).val('');
					$(this).css({
						'font-weight' : 'normal',
						'font-style' : 'normal',
						'color' : 'black'
					});
				}else{
					//
				}
			});

			// When leving the filter, add the hint text if there is no filter text
			$(document).on('focusout', '#' + thisMainID + ' input.dsl-filter-input', function() {
				var fltText = $(this).val();
				if (fltText == '') {
					$(this).val(CONST_FILTER_PLACEHOLDER);
					$(this).css({
						'font-weight' : 'bolder',
						'font-style' : 'Italic',
						'color' : 'lightgray'
					});
				}else{
					//
				}
			});

			// When some text input to the filter, do filter and display Move button.
			$(document).on('keyup', '#' + thisMainID + ' input.dsl-filter-input', function() {
				var fltText = $(this).val();
				var tarPanel = null;
					if ($(this).parent('div.dsl-filter').hasClass('left-panel')) {
					tarPanel = thisPanel.left;
				}else{
					tarPanel = thisPanel.right;
				}

				// update Move All Icon and Items display
				toggleMoveAllIcon(CONST_BOTH);
				toggleItemDisplay(CONST_BOTH);
			});

			$('#' + thisMainID + ' div.dsl-filter-move-all').click(function(){
				// find all filtered items and trigger click()
				var tarPanel = null;
				if ($(this).hasClass('left-panel')) tarPanel = thisPanel.left;
				else								tarPanel = thisPanel.right;

				tarPanel.find('div.dsl-panel-item:visible').each(function(){
					$(this).trigger('mousedown');
					$(this).trigger('mouseup');
				});

				toggleMoveAllIcon(CONST_BOTH);
				toggleItemDisplay(CONST_BOTH);
			});
		};

		// Allow user to create the DualSelectList object first, and add candidate list later.
		// append the input candidate into thisCandidateItems and record index for getSelection()
		this.setCandidate = function (candidate) {
			for (var n=0; n<candidate.length; ++n) {
				// check if this item is an object
				if (candidate[n].value === undefined) candidate[n] = {value : candidate[n]};

				var thisIdx = thisCandidateItems.push(candidate[n]) - 1;
				var itemString = $.trim(thisCandidateItems[thisIdx].value.toString());
				if (itemString == '') continue;
				thisPanel.left.append('<div class="dsl-panel-item" dlid="c' + thisIdx + '">' + itemString + '</div>');
			}
		};

		// Allow user to create the DualSelectList object first, and add selection list later.
		// append the input selection into thisSelectionItems and record index for getSelection()
		this.setSelection = function (selection) {
			for (var n=0; n<selection.length; ++n) {
				// check if this item is an object
				if (selection[n].value === undefined) selection[n] = {value : selection[n]};

				var thisIdx = thisSelectionItems.push(selection[n]) - 1;
				var itemString = $.trim(thisSelectionItems[thisIdx].value.toString());
				if (itemString == '') continue;
				thisPanel.right.append('<div class="dsl-panel-item" dlid="s' + thisIdx + '">' + itemString + '</div>');
			}
		};

		// Allow user to get current selection result
		this.getSelection = function (stringOnly) {
			var result = new Array();
			var selection = thisPanel.right.find('div.dsl-panel-item');
			for (var n=0; n<selection.length; ++n)
			{
				if (stringOnly) result.push(selection.eq(n).text());
				else
				{
					var thisIdx = selection.eq(n).attr('dlid');
					if (thisIdx.startsWith('c')) {
						thisIdx = eval(thisIdx.substring(1));
						result.push(thisCandidateItems[thisIdx]);
					}else{
						thisIdx = eval(thisIdx.substring(1));
						result.push(thisSelectionItems[thisIdx]);
					}
				}
			}
			return result;
		};

		// Allow user to change object color
		this.setColor = function (clsName, clrString) {
			clsName = $.trim(clsName);
			clrString = $.trim(clrString);
			if (!clrString) return;

			switch(clsName) {
				case 'panelBackground' :
					params.colors.panelBackground = clrString;
					break;
				case 'filterText' :
					params.colors.filterText = clrString;
					break;
				case 'itemText' :
					params.colors.itemText = clrString;
					break;
				case 'itemBackground' :
					params.colors.itemBackground = clrString;
					break;
				case 'itemHoverBackground' :
					params.colors.itemHoverBackground = clrString;
					break;
				case 'itemPlaceholderBackground' :
					params.colors.itemPlaceholderBackground = clrString;
					break;
				case 'itemPlaceholderBorder' :
					params.colors.itemPlaceholderBorder = clrString;
					break;
			}

			appendColorStyle();
		};

		// Allow user to reset object color
		this.resetColor = function (clsName) {
			clsName = $.trim(clsName);
			switch(clsName) {
				case 'panelBackground' :
					params.colors.panelBackground = '';
					break;
				case 'filterText' :
					params.colors.filterText = '';
					break;
				case 'itemText' :
					params.colors.itemText = '';
					break;
				case 'itemBackground' :
					params.colors.itemBackground = '';
					break;
				case 'itemHoverBackground' :
					params.colors.itemHoverBackground = '';
					break;
				case 'itemPlaceholderBackground' :
					params.colors.itemPlaceholderBackground = '';
					break;
				case 'itemPlaceholderBorder' :
					params.colors.itemPlaceholderBorder = '';
					break;
				case '' :
					params.colors = {
						panelBackground: '',
						filterText: '',
						itemText: '',
						itemBackground: '',
						itemHoverBackground: '',
						itemPlaceholderBackground: '',
						itemPlaceholderBorder: ''
					};
					break;
			}

			appendColorStyle();
		};

		// Function for item location calculation, not public to user.
		function findItemLocation(objItem) {
			var target = {
				targetPanel: null,
				targetItem: null,
				targetFirstPosition: false
			};

			if (objItem.position().left <= (thisPanel.left.position().left + (0.5 * thisPanel.left.width()))) {
				target.targetPanel = thisPanel.left;
			}else{
				target.targetPanel = thisPanel.right;
			}

			var candidateItems = target.targetPanel.find('div.dsl-panel-item');
			for (var n=0; n<candidateItems.length; ++n) {
				if (objItem.position().top > candidateItems.eq(n).position().top) {
					target.targetItem = candidateItems[n];
				} else if (objItem.position().top <= candidateItems.eq(n).position().top && n === 0){
					target.targetFirstPosition = true;
				}
			}

			return target;
		};

		// Function for item location calculation, not public to user.
		function appendColorStyle() {
			var cssContent = 
				( !params.colors.panelBackground           ? '' : '.dsl-panel {background-color: ' + params.colors.panelBackground + ' !important;} ') +
				( !params.colors.filterText                ? '' : '.dsl-filter-input {color: ' + params.colors.filterText + ' !important;} ') +
				( !params.colors.itemText                  ? '' : '.dsl-panel-item {color: ' + params.colors.itemText + ' !important;} ') +
				( !params.colors.itemBackground            ? '' : '.dsl-panel-item {background-color: ' + params.colors.itemBackground + ' !important;} ') +
				( !params.colors.itemHoverBackground       ? '' : '.dsl-panel-item:hover {background-color: ' + params.colors.itemHoverBackground + ' !important;} ') +
				( !params.colors.itemPlaceholderBackground ? '' : '.dsl-panel-item-null {background-color: ' + params.colors.itemPlaceholderBackground + ' !important;} ') +
				( !params.colors.itemPlaceholderBorder     ? '' : '.dsl-panel-item-null {border-color: ' + params.colors.itemPlaceholderBorder + ' !important;} ') ;
			$('#dual-select-list-style').remove();
			if (cssContent) $('html>head').append($('<style id="dual-select-list-style">' + cssContent + '</style>'));
		};

		// Toggle display of "Move All" icon
		function toggleMoveAllIcon(target) {
			if (target | CONST_LEFT) {
				var lftItems = thisPanel.left.find('div.dsl-panel-item:visible');
				if (lftItems.length > 0) thisMover.left.show();
				else					 thisMover.left.hide();
			}
			if (target | CONST_RIGHT) {
				var RgtItems = thisPanel.right.find('div.dsl-panel-item:visible');
				if (RgtItems.length > 0) thisMover.right.show();
				else					 thisMover.right.hide();
			}
		}

		// Toggle Item Display according to current filter
		function toggleItemDisplay(target) {
			if (target | CONST_LEFT) {
				var lftFilterText = thisInput.left.val();
				thisPanel.left.find('div.dsl-panel-item').show();
				if (lftFilterText == CONST_FILTER_PLACEHOLDER) lftFilterText = '';
				if (lftFilterText != '') {
					thisPanel.left.find('div.dsl-panel-item:not(:contains(' + lftFilterText + '))').hide();
				}
			}
			if (target | CONST_RIGHT) {
				var RgtFilterText = thisInput.right.val();
				thisPanel.right.find('div.dsl-panel-item').show();
				if (RgtFilterText == CONST_FILTER_PLACEHOLDER) RgtFilterText = '';
				if (RgtFilterText != '') {
					thisPanel.right.find('div.dsl-panel-item:not(:contains(' + RgtFilterText + '))').hide();
				}
			}

		}

		this.init();
		return this;
	}

	$.fn.DualSelectList.defaults = {
		candidateItems: [],
		selectionItems: [],
		colors: {
			panelBackground: '',
			filterText: '',
			itemText: '',
			itemBackground: '',
			itemHoverBackground: '',
			itemPlaceholderBackground: '',
			itemPlaceholderBorder: ''
		}
	};

})(jQuery);

