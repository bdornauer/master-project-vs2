const WebcamController = {
    drawIcon: function (ctx, icon, x, y, width, height) {
        let img = new Image();
        img.src = icon;
        img.onload = function () {
            ctx.drawImage(img, x, y, width, height);
        }
    },
    /**
     * in a 640x480 pixel grid
     * ----------------------
     * |   1  |   2  |   3  |
     * ----------------------
     * |   4  |   5  |   6  |
     * ----------------------
     * |   7 |   8  |   9   |
     * ----------------------
     * 1: topLeft 2:topCenter 3:topRight;
     * 4: centerLeft 5:centerCenter 6:centerRight
     * 7: bottomLeft 8:bottomCenter 9:bottomRight
     */
    positionInGrid: function (xPosition, yPosition, screenWidth, screenHeight) {
        //top to bottom
        let gridName = "nothing detected";

        if (yPosition < screenHeight * (1 / 3)) {
            gridName = "top"
        } else if (yPosition < screenHeight * (2 / 3)) {
            gridName = "center"
        } else {
            gridName = "bottom"
        }
        //left to right
        if (xPosition < screenWidth * (1 / 3)) {
            gridName += "Left"
        } else if (xPosition < screenWidth * (2 / 3)) {
            gridName += "Center"
        } else {
            gridName += "Right"
        }
        return (gridName);
    },
    /**
     * BBox consists of two points
     * - (bbox[0],bbox[1]) ist  (minX, minY) --> left top
     * - (bbox[2],bbox[3]) (deltaX, deltY) in this way maxX = minX + deltX
     * to receive the bounding box
     * see: http://underpop.online.fr/j/java/img/fig09_01.jpg
     */
    calculateCenterOfBBox: function (minX, minY, deltaX, deltaY) {
        return [minX + deltaX / 2, minY + deltaY / 2]
    },
    predictionPositionToString: function (xPosition, yPosition) {
        return "(" + Math.round(xPosition) + ", " + Math.round(yPosition) + ")"
    },
    containsPredictions: function (array) {
        return array !== undefined && array.length >= 1;
    },
    /** closedHand means that the hand is open (a bit confusing)*/
    filterPinchAndClosedHandGesture: function (array) {
        if (array !== undefined && array.length >= 1) {
            return array.filter(element => element.label === "pinch" || element.label === "closed");
        } else {
            return []
        }
    }
}

export default WebcamController;
