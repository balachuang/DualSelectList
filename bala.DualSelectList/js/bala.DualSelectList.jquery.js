(function($) {

	$.fn.DualSelectList = function(parameter)
	{
		if (this.length != 1) return;
		if (this.prop('tagName') != 'DIV') return;

		var params = $.extend({}, $.fn.DualSelectList.defaults, parameter);

		var thisMain = null;
		var thisLftPanel = null;
		var thisRgtPanel = null;
		var thisItemNull = null;

		var thisSelect = null;
		var srcEvent = null;
		var isPickup = false;
		var isMoving = false;
		var xOffset = null;
		var yOffset = null;

		this.init = function () {
			this.append(
				'<div class="dsl-filter left-panel" ><input class="dsl-filter-input" tyle="text" value="Input Filter"></div>' +
				'<div class="dsl-filter right-panel"><input class="dsl-filter-input" tyle="text" value="Input Filter"></div>' +
				'<div class="dsl-panel left-panel" /><div class="dsl-panel right-panel"></div>' +
				'<div class="dsl-panel-item-null">&nbsp;</div>'
			);

			thisMain = this;
			thisLftPanel = this.find('div.dsl-panel.left-panel');
			thisRgtPanel = this.find('div.dsl-panel.right-panel');
			thisItemNull = this.find('div.dsl-panel-item-null');

			if(typeof(params.candidiateItems) === 'string') params.candidiateItems = [params.candidiateItems];
			if (params.candidiateItems.length > 0) this.setCandidate(params.candidiateItems);

			$(document).on('mousedown', 'div.dsl-panel-item', function(event) {
				thisSelect = $(this);
				isPickup = true;
				srcEvent = event;
				event.preventDefault();
			});

//			$(document).on('mousemove', 'div.dsl-panel-item', function(event) {
//				// move this item...
//				if (isPickup) {
//					if (isMoving) {
//						$(this).css({
//							'left' : event.screenX + xOffset,
//							'top'  : event.screenY + yOffset
//						});
//
//						var target = findItemLocation($(this));
//						if (target.targetItem == null) {
//							thisItemNull.appendTo(target.targetPanel).show();
//						}else{
//							thisItemNull.insertAfter(target.targetItem).show();
//						}
//					}else{
//						if ((Math.abs(event.screenX - srcEvent.screenX) >= 2) ||
//							(Math.abs(event.screenY - srcEvent.screenY) >= 2))
//						{
//							isMoving = true;
//
//							var srcPanel = $(this).parent('div.dsl-panel');
//							var xSrc = $(this).position().left;
//							var ySrc = $(this).position().top;
//							xOffset = xSrc - event.screenX;
//							yOffset = ySrc - event.screenY;
//							$(this).css({
//								'position' : 'absolute',
//								'z-index' : 10,
//								'left' : xSrc,
//								'top' : ySrc,
//								'width' : srcPanel.width()
//							}).appendTo(thisMain);
//						}
//					}
//				}
//
//				event.preventDefault();
//			});

			$(document).on('mousemove', 'body', function(event) {
				// move this item...
				if (isPickup) {
					if (isMoving) {
						thisSelect.css({
							'left' : event.screenX + xOffset,
							'top'  : event.screenY + yOffset
						});

						var target = findItemLocation(thisSelect);
						if (target.targetItem == null) {
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

			$(document).on('mouseup', 'div.dsl-panel-item', function(event) {
				if (isPickup && !isMoving) {
					// fly to another panel
					var srcPanel = $(this).parent('div.dsl-panel');
					var tarPanel = srcPanel.siblings('div.dsl-panel');
					var tarItem = tarPanel.find('div.dsl-panel-item:last');

					var xSrc = $(this).position().left;
					var ySrc = $(this).position().top;
					var xTar = 0;
					var yTar = 0; 
					if (tarItem.length > 0) {
						xTar = tarItem.position().left;
						yTar = tarItem.position().top + tarItem.height();
					}else{
						xTar = tarPanel.position().left;
						yTar = tarPanel.position().top; 
					}

					$(this).css({
						'position' : 'absolute',
						'z-index' : 10,
						'left' : xSrc,
						'top' : ySrc,
						'width' : srcPanel.width()
					}).animate({
						left: xTar,
						top: yTar
					},200, function(){
						$(this).css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).appendTo(tarPanel);
					});
				}

				if (isPickup && isMoving) {
					// drag-n-drop item
					var target = findItemLocation($(this));
					if (target.targetItem == null) {
						$(this).css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).appendTo(target.targetPanel);
					}else{
						$(this).css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).insertAfter(target.targetItem);
					}
				}

				isPickup = false;
				isMoving = false;
				thisItemNull.appendTo(thisMain).hide();
			});

			$(document).on('focus', 'input.dsl-filter-input', function() {
				var fltText = $(this).val();
				if (fltText == 'Input Filter') {
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

			$(document).on('focusout', 'input.dsl-filter-input', function() {
				var fltText = $(this).val();
				if (fltText == '') {
					$(this).val('Input Filter');
					$(this).css({
						'font-weight' : 'bolder',
						'font-style' : 'Italic',
						'color' : 'lightgray'
					});
				}else{
					//
				}
			});

			$(document).on('keyup', 'input.dsl-filter-input', function() {
				var fltText = $(this).val();
				var tarPanel = null;
				if ($(this).parent('div.dsl-filter').hasClass('left-panel')) {
					tarPanel = thisLftPanel;
				}else{
					tarPanel = thisRgtPanel;
				}

				tarPanel.find('div.dsl-panel-item').show();
				if (fltText != '') {
					tarPanel.find('div.dsl-panel-item:not(:contains(' + fltText + '))').hide();
//					tarPanel.find('div.dsl-panel-item:contains(' + fltText + ')').show();
				}
			});
		};

		this.setCandidate = function (candidate) {
			for (var n=0; n<candidate.length; ++n) {
				var itemString = $.trim(candidate[n].toString());
				if (itemString == '') continue;
				thisLftPanel.append('<div class="dsl-panel-item">' + itemString + '</div>');
			}
		};

		this.setSelection = function (selection) {
			for (var n=0; n<selection.length; ++n) {
				var itemString = $.trim(selection[n].toString());
				if (itemString == '') continue;
				thisRgtPanel.append('<div class="dsl-panel-item">' + itemString + '</div>');
			}
		};

		this.getSelection = function () {
			var result = new Array();
			var selection = thisRgtPanel.find('div.dsl-panel-item');
			for (var n=0; n<selection.length; ++n) result.push(selection.eq(n).text());
			return result;
		};

		function findItemLocation(objItem) {
			var target = {
				targetPanel: null,
				targetItem: null
			};
			//var targetPanel = null;
			if (objItem.position().left <= (0.5 * thisLftPanel.width())) {
				target.targetPanel = thisLftPanel;
			}else{
				target.targetPanel = thisRgtPanel;
			}

			//var targetItem = null;
			var candidateItems = target.targetPanel.find('div.dsl-panel-item');
			for (var n=0; n<candidateItems.length; ++n) {
				if (objItem.position().top > candidateItems.eq(n).position().top) target.targetItem = candidateItems[n];
			}

			//return targetItem;
			return target;
		};

		this.init();
		return this;
	}

	$.fn.DualSelectList.defaults = {
		candidiateItems: [],
		addAll: 'Add All',
		remove: 'Remove',
		removeAll: 'Remove All'
	};

})(jQuery);
