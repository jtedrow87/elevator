/*
 *  Functional Requirements:
 *  
 *  A floor can be selected from the elevator panel.
 *  A visual cue is provided of which floor was selected.
 *  A visual cue is provided of the current floor.
 *  A visual cue is provided of the elevator's direction (up/down).
 *  The panel provides a visual cue when you have arrived at the selected floor.
 *	Selecting a button anchor does not navigate or change the URL.
 */
var floorOffsets = [1800,1200,600,0],
	floorTiming = 1000,
	lastFloor=0,
	lastDir = 'down',
	isRunning=false,
	pendingFloors=[];
function gotoFloor(floorLevel,followUp,callback){
		if(floorLevel == lastFloor){
			return;
		}
		if(isRunning && !followUp){
			pendingFloors[pendingFloors.length] = floorLevel;
			return;
		}
		if(!followUp){
			pendingFloors[pendingFloors.length] = floorLevel;
		}
		thisTiming = figureTiming(floorLevel);
		if(lastFloor !== floorLevel){
			var cDir = showIndicator(floorLevel);
		}
		lastFloor = floorLevel;
		isRunning = true;
		$('#floors,#led_floors').animate({
            scrollTop:floorOffsets[lastFloor-1]
        }, thisTiming,'swing',function(){
			lastDir = cDir;
			$('#button_'+floorLevel).removeClass('active');
			if(pendingFloors.length){
				if(pendingFloors[0]==floorLevel){
					pendingFloors.shift();
				}
				if(pendingFloors.length){
					gotoFloor(pendingFloors[0],true)
					return;
				}
				$('.lightUp').removeClass('lightUp');
			}else{
				$('.button').removeClass('active');
			}
			isRunning = false;
		});
}
function figureTiming(nextLevel){
	return ((lastFloor < nextLevel) ? (nextLevel - lastFloor) : (lastFloor - nextLevel)) * floorTiming;
}
function showIndicator(nextLevel){
	var lightDirection = ((parseInt(lastFloor) > parseInt(nextLevel))) ? 'down' : 'up';
	$('.lightUp').removeClass('lightUp');
	$('#direction_'+lightDirection).removeClass('lightUp').addClass('lightUp');
	return lightDirection;
}
function forceIndicator(direction){
	$('#direction_'+direction).addClass('lightUp');
}
$(document).ready(function(){
	gotoFloor(1);
	$('.button').click(function(e) {
        e.preventDefault();
		if($(this).hasClass('active') || $(this).attr('floor') == lastFloor){
			return;
		}
		$(this).addClass('active');
		gotoFloor($(this).attr('floor'),false);
    });
});
