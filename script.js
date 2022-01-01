value = 1000;
swipeDirection = ""
prevSwipe = ""
amountSwipes = 0
thumbsUpReceived = false;

setInterval(function(){prevSwipe = "", swipeDirection = ""}, 800);
setInterval(function(){
    const ctx = document.getElementById('canvas').getContext("2d");
    ctx.clearRect(0, 0, 1000, 1000);
})

var controller = Leap.loop({enableGestures: true}, function(frame){
    if(frame.valid && frame.gestures.length > 0){
        for (var i = 0; i < frame.gestures.length; i++) {
            var gesture = frame.gestures[i];
            console.log(gesture.type)
      
            if (gesture.type == "swipe") {
                determineSwipeDirection(gesture);
            }
            /*if (gesture.type == "keyTap"){
                button = getSelectedButton();
                button.click();
            }*/
        }
    }
    if (prevSwipe != swipeDirection){
        prevSwipe = swipeDirection;
        if (swipeDirection == "up" || swipeDirection == "left"){
            amountSwipes -= 1
        } else {
            amountSwipes += 1
        }
        changeTab()
    }

    if(frame.valid && frame.fingers.length >= 5){
        const ctx = document.getElementById('canvas').getContext("2d");
        drawHand(frame.hands, ctx);
        
        if( frame.fingers[0].extended && !frame.fingers[1].extended && !frame.fingers[2].extended && !frame.fingers[3].extended && !frame.fingers[4].extended){
            console.log('thumbs up')
            if(!thumbsUpReceived){
                thumbsUpReceived = true;
                button = getSelectedButton();
                button.click();
            }
        } else {thumbsUpReceived = false}
    }

  });

  drawHand = (hands, ctx) => {
    if (hands.length > 0){
        hands.forEach((hand) => {
            hand.fingers.forEach((finger) => {
                finger.bones.forEach((bone) => {
                    ctx.beginPath();
                    ctx.moveTo(bone.prevJoint[0]+100, bone.prevJoint[2])
                    ctx.lineTo(bone.nextJoint[0]+100, bone.nextJoint[2])
                    ctx.lineWidth = bone.prevJoint[1]/40;
                    if(bone != hand.fingers[0].bones[0]){
                        ctx.arc(bone.nextJoint[0]+100, bone.nextJoint[2], bone.nextJoint[1]/40+1, 0, 3 * Math.PI);
                    }
                    if (finger.extended){
                        ctx.strokeStyle = "blue";
                        ctx.fillStyle = "blue";
                    } else {
                        ctx.strokeStyle = "red";
                        ctx.fillStyle = "red";
                    }
                    ctx.stroke();
                    ctx.fill();
                })
            })
        })
    }
  };

  determineSwipeDirection = (gesture) => {
    var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

    if(isHorizontal){
        if(gesture.direction[0] > 0){
            swipeDirection = "right";
        } else {
            swipeDirection = "left";
        }
    } else {
        if(gesture.direction[1] > 0){
            swipeDirection = "up";
        } else {
            swipeDirection = "down";
        }                  
    }
    console.log(swipeDirection);
  }

const changeTab = () => {
    prevTabs = document.getElementsByClassName('selected');
    for(tab of prevTabs){tab.className = ""}
    button = getSelectedButton();
    button.classList.add('selected');
}

const getSelectedButton = () => {
    switch(amountSwipes%3) {
        case 0:
            return document.getElementById('storten')
        case 1:
        case -2:
            return document.getElementById('afhalen')
        case 2:
        case -1:
            return document.getElementById('uitloggen')
      }
}

const emptyPrev = () => {
    console.log('test')
    prevSwipe = "";
}

const updateValue = () => {
    valueLabel = document.getElementById('value');
    valueLabel.textContent = "€" + value;
}

const handleStortenClick = () => {
    value += 10
    updateValue();
}

const handleAfhalenClick = () => {
    value -=10
    updateValue();
}

const handleUitloggenClick = () => {
    window.close();
}

const init = () => {
    updateValue();
    changeTab();
    document.getElementById('storten').addEventListener('click', handleStortenClick);
    document.getElementById('afhalen').addEventListener('click', handleAfhalenClick);
    document.getElementById('uitloggen').addEventListener('click', handleUitloggenClick);
}

init();