(function($) {

	$.fn.DualSelectList = function(parameter)
	{
		if (this.length != 1) return;
		if (this.prop('tagName') != 'DIV') return;

		var params = $.extend({}, $.fn.DualSelectList.defaults, parameter);

		var thisMain = null;
		var thisLftPanel = null;
		var thisRgtPanel = null;

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
				'<div class="dsl-panel left-panel" /><div class="dsl-panel right-panel" />'
			);

			thisMain = this;
			thisLftPanel = this.find('div.dsl-panel.left-panel');
			thisRgtPanel = this.find('div.dsl-panel.right-panel');

			if(typeof(params.candidiateItems) === 'string') params.candidiateItems = [params.candidiateItems];
			if (params.candidiateItems.length > 0) this.setCandidate(params.candidiateItems);

			$('div.dsl-panel-item').on( "mousedown", function(event) {
				thisSelect = this;
				isPickup = true;
				srcEvent = event;
				event.preventDefault();
			});

			$('div.dsl-panel-item').on( "mousemove", function(event) {
				// move this item...
				if (isPickup) {
					if (isMoving) {
						$(this).css({
							'left' : event.screenX + xOffset,
							'top'  : event.screenY + yOffset
						});
					}else{
						if ((Math.abs(event.screenX - srcEvent.screenX) >= 2) ||
							(Math.abs(event.screenY - srcEvent.screenY) >= 2))
						{
							isMoving = true;

							var srcPanel = $(this).parent('div.dsl-panel');
							var xSrc = $(this).position().left;
							var ySrc = $(this).position().top;
							xOffset = xSrc - event.screenX;
							yOffset = ySrc - event.screenY;
							$(this).css({
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

			$('div.dsl-panel-item').on( "mouseup", function(event) {
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
					var tarItem = findItemLocation($(this));
					if (tarItem == null) {
						$(this).css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).appendTo(thisRgtPanel);
					}else{
						$(this).css({
							'position' : 'initial',
							'z-index' : 'initial',
							'width' : 'calc(100% - 16px)'
						}).insertAfter(tarItem);
					}
				}

				isPickup = false;
				isMoving = false;
			});

			$('input.dsl-filter-input').on( "focus", function() {
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

			$('input.dsl-filter-input').on( "focusout", function() {
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

			$('input.dsl-filter-input').on( "keyup", function() {
				var fltText = $(this).val();
				var tarPanel = null;
				if ($(this).parent('div.dsl-filter').hasClass('left-panel')) {
					tarPanel = thisLftPanel;
				}else{
					tarPanel = thisRgtPanel;
				}

				if (fltText == '') {
					tarPanel.find('div.dsl-panel-item').show();
				}else{
					console.log(tarPanel.find('div.dsl-panel-item').length);
					console.log(tarPanel.find('div.dsl-panel-item:contains(' + fltText + ')').length);
					tarPanel.find('div.dsl-panel-item:not(:contains(' + fltText + '))').hide();
				}
			});
		};

		this.setCandidate = function (candidate) {
			for (var n=0; n<candidate.length; ++n) {
				thisLftPanel.append('<div class="dsl-panel-item">' + candidate[n].toString() + '</div>');
			}
		};

		this.setSelection = function (selection) {
			for (var n=0; n<selection.length; ++n) {
				thisRgtPanel.append('<div class="dsl-panel-item">' + selection[n].toString() + '</div>');
			}
		};

		this.getSelection = function () {
			var result = new Array();
			var selection = thisRgtPanel.find('div.dsl-panel-item');
			for (var n=0; n<selection.length; ++n) result.push(selection.eq(n).text());
			return result;
		};

		function findItemLocation(objItem) {
			var targetPanel = null;
			if (objItem.position().left <= (0.5 * thisLftPanel.width())) {
				targetPanel = thisLftPanel;
			}else{
				targetPanel = thisRgtPanel;
			}

			var targetItem = null;
			var candidateItems = targetPanel.find('div.dsl-panel-item');
			for (var n=0; n<candidateItems.length; ++n) {
				if (objItem.position().top > candidateItems.eq(n).position().top) targetItem = candidateItems[n];
			}

			console.log(targetItem);
			return targetItem;
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
