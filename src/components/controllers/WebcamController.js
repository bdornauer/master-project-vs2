import zoomOut from "../icons/ZoomOut.svg";
import arrowUp from "../icons/arrowUp.svg";
import zoomIn from "../icons/ZoomIn.svg";
import arrowLeft from "../icons/arrowLeft.svg";
import menu2 from "../icons/menu1.svg";
import arrowRight from "../icons/arrowRight.svg";
import contrastMinus from "../icons/brightnessMinus.svg";
import arrowDown from "../icons/arrowDown.svg";
import contrastPlus from "../icons/brightnessPlus.svg";
import saturationMinus from "../icons/saturationMinus.svg";
import saturationPlus from "../icons/saturationPlus.svg";
import invert from "../icons/invert.svg";
import cancel from "../icons/cancel.svg";
import Colors from "../Colors";
import colors from "../Colors";

function drawIcon(ctx, icon, x, y, width, height) {
    let img = new Image();
    img.src = icon;
    img.onload = function () {
        ctx.drawImage(img, x, y, width, height);
    }
}

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
export function positionInGrid(xPosition, yPosition, screenWidth, screenHeight) {
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
}

/**
 * BBox consists of two points
 * - (bbox[0],bbox[1]) ist  (minX, minY) --> left top
 * - (bbox[2],bbox[3]) (deltaX, deltY) in this way maxX = minX + deltX
 * to receive the bounding box
 * see: http://underpop.online.fr/j/java/img/fig09_01.jpg
 */
export function calculateCenterOfBBox(minX, minY, deltaX, deltaY) {
    return [minX + deltaX / 2, minY + deltaY / 2]
}

export function predictionPositionToString(xPosition, yPosition) {
    return "(" + Math.round(xPosition) + ", " + Math.round(yPosition) + ")"
}

export function containsPredictions(array) {
    return array !== undefined && array.length >= 1;
}

export function higlichtSection(highlighting, x, y, sectionWidth, sectionHeight, screenWidth, screenHeight) {
    removeCanvasLayer(highlighting, screenWidth, screenHeight)
    let ctx = highlighting.current.getContext('2d');
    ctx.beginPath();
    ctx.rect(x, y, sectionWidth, sectionHeight);
    ctx.lineWidth = 0
    ctx.fillStyle = colors.brightBlueSemiTransprerent;
    ctx.fill();
    ctx.stroke();
}

export function highlightSectionActive(gridSection, highlighting, screenWidth, screenHeight) {
    const sectionWidth = screenWidth / 3;
    const sectionHeight = screenHeight / 3;

    switch (gridSection) {
        case "topLeft":
            higlichtSection(highlighting, 0, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "topCenter":
            higlichtSection(highlighting, sectionWidth, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "topRight":
            higlichtSection(highlighting, 2*sectionWidth, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerLeft":
            higlichtSection(highlighting, 0, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerCenter":
            higlichtSection(highlighting, sectionWidth, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerRight":
            higlichtSection(highlighting, 2 * sectionWidth, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomLeft":
            higlichtSection(highlighting, 0, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomCenter":
            higlichtSection(highlighting, sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomRight":
            higlichtSection(highlighting, 2 * sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        default:
            removeCanvasLayer(highlighting,screenWidth, screenHeight);
    }
}


export function removeCanvasLayer(canvas, screenWidth, screenHeight) {
    let ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, screenWidth, screenHeight);
}

export function drawGridOverlay(grid, screenWidth, screenHeight) {
    let ctx = grid.current.getContext('2d');
    let stepsWidth = screenWidth / 3;
    let stepsHeight = screenHeight / 3;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = Colors.brightBlue;
    //horiziontal lines
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(stepsWidth * i, 0);
        ctx.lineTo(stepsWidth * i, screenHeight);
    }

    //vertical lines
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(0, stepsHeight * i);
        ctx.lineTo(screenWidth, stepsHeight * i);
    }
    ctx.stroke();
};

/** closedHand means that the hand is open (a bit confusing)*/
export function filterPinchAndClosedHandGesture(array) {
    if (array !== undefined && array.length >= 1) {
        return array.filter(element => element.label === "pinch" || element.label === "closed");
    } else {
        return []
    }
}


export function drawIconsMenu1(iconsLayer, iconSize, screenWidth, screenHeight) {
    let sectionVertical = screenHeight / 6;
    let sectionHorizontal = screenWidth / 6;
    let halfSizeIcon = iconSize / 2;
    let ctx = iconsLayer.current.getContext('2d')
    drawIcon(ctx, zoomOut, sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, arrowUp, 3 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, zoomIn, 5 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, arrowLeft, sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, menu2, 3 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, arrowRight, 5 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, contrastMinus, sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, arrowDown, 3 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, contrastPlus, 5 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
}

export function drawIconsMenu2(iconsLayer, iconSize, screenWidth, screenHeight) {
    let sectionVertical = screenHeight / 6;
    let sectionHorizontal = screenWidth / 6;
    let halfSizeIcon = iconSize / 2;
    let ctx = iconsLayer.current.getContext('2d')
    drawIcon(ctx, saturationMinus, sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, cancel, 3 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, saturationPlus, 5 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, invert, sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, menu2, 3 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, cancel, 5 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, contrastMinus, sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, arrowDown, 3 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, contrastPlus, 5 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
}