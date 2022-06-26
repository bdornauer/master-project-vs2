import zoomOut from "../../assets/icons/ZoomOut.svg";
import arrowUp from "../../assets/icons/arrowUp.svg";
import zoomIn from "../../assets/icons/ZoomIn.svg";
import arrowLeft from "../../assets/icons/arrowLeft.svg";
import menu1 from "../../assets/icons/menu1.svg";
import menu2 from "../../assets/icons/menu2.svg";
import arrowRight from "../../assets/icons/arrowRight.svg";
import contrastMinus from "../../assets/icons/brightnessMinus.svg";
import arrowDown from "../../assets/icons/arrowDown.svg";
import contrastPlus from "../../assets/icons/brightnessPlus.svg";
import saturationMinus from "../../assets/icons/saturationMinus.svg";
import saturationPlus from "../../assets/icons/saturationPlus.svg";
import invert from "../../assets/icons/invert.svg";
import cancel from "../../assets/icons/cancel.svg";
import turnLeft from "../../assets/icons/turnLeft.svg"
import turnRight from "../../assets/icons/turnRight.svg"
import Colors from "../Colors";


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
 *
 * @param xPosition
 * @param yPosition
 * @param screenWidth
 * @param screenHeight
 * @returns {string}
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

export function containsPrediction(array) {
    return array !== undefined && array.length >= 1;
}

/**
 * Higlights a section, drawing a semitransperecent rectangle over it.
 * @param highlighting canvas layer
 * @param xLeftTopCorner LeftTop corner xLeftTopCorner-coordinate
 * @param yLeftTopCorner LeftTop corner yLeftTopCorner-coordinate
 */
export function higlightSection(highlighting, xLeftTopCorner, yLeftTopCorner, sectionWidth, sectionHeight, screenWidth, screenHeight) {
    removeCanvasLayer(highlighting, screenWidth, screenHeight)
    let ctx = highlighting.current.getContext('2d');
    ctx.beginPath();
    ctx.rect(xLeftTopCorner, yLeftTopCorner, sectionWidth, sectionHeight);
    ctx.lineWidth = 0
    ctx.fillStyle = Colors.brightBlueSemiTransprerent;
    ctx.fill();
    ctx.stroke();
}

/**
 * Higlights the selected grid sections with a semitransperecent rectangle
 * @param highlighting specific canvas
 */
export function highlightSectionActive(gridSectionName, highlighting, screenWidth, screenHeight) {
    const sectionWidth = screenWidth / 3;
    const sectionHeight = screenHeight / 3;

    switch (gridSectionName) {
        case "topLeft":
            higlightSection(highlighting, 0, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "topCenter":
            higlightSection(highlighting, sectionWidth, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "topRight":
            higlightSection(highlighting, 2 * sectionWidth, 0, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerLeft":
            higlightSection(highlighting, 0, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerCenter":
            higlightSection(highlighting, sectionWidth, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "centerRight":
            higlightSection(highlighting, 2 * sectionWidth, sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomLeft":
            higlightSection(highlighting, 0, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomCenter":
            higlightSection(highlighting, sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        case "bottomRight":
            higlightSection(highlighting, 2 * sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight, screenWidth, screenHeight)
            break;
        default:
            removeCanvasLayer(highlighting, screenWidth, screenHeight);
    }
}

/**
 * Removes all drawing of canvas layer
 */
export function removeCanvasLayer(canvas, canvasWidth, canvasHeight) {
    let ctx = canvas.current.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Draws the lines for the grid
 * @param grid
 * @param canvasWidth
 * @param canvasHeight
 */
export function drawGridOverlay(grid, canvasWidth, canvasHeight) {
    let ctx = grid.current.getContext('2d');
    let stepsWidth = canvasWidth / 3;
    let stepsHeight = canvasHeight / 3;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = Colors.brightBlue;
    //horiziontal lines
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(stepsWidth * i, 0);
        ctx.lineTo(stepsWidth * i, canvasHeight);
    }

    //vertical lines
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(0, stepsHeight * i);
        ctx.lineTo(canvasWidth, stepsHeight * i);
    }
    ctx.stroke();
}

/**
 * Filters the two gestures: pinch and open hand
 */
export function filterPinchAndOpenHandGesture(array) {
    if (array !== undefined && array.length >= 1) {
        return array.filter(element => element.label === "pinch" || element.label === "closed"); //ATTENTION: closed means open hand
    } else {
        return []
    }
}

/**
 * Draws an icon at specific position
 * @param ctx canvas context to draw on
 * @param icon object
 * @param x leftTopCorner position
 * @param y leftTopCorner position
 * @param width  of icion
 * @param height of icon
 */
function drawIcon(ctx, icon, x, y, width, height) {
    let img = new Image();
    img.src = icon;
    img.onload = function () {
        ctx.drawImage(img, x, y, width, height);
    }
}

/**
 * Draw specific icons, if menu 1 is selected
 */
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

/**
 * Draw specific icons, if menu 2 is selected
 */
export function drawIconsMenu2(iconsLayer, iconSize, screenWidth, screenHeight) {
    let sectionVertical = screenHeight / 6;
    let sectionHorizontal = screenWidth / 6;
    let halfSizeIcon = iconSize / 2;
    let ctx = iconsLayer.current.getContext('2d')
    drawIcon(ctx, saturationMinus, sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, cancel, 3 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, saturationPlus, 5 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
    drawIcon(ctx, invert, sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, menu1, 3 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, cancel, 5 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, turnLeft, sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    //drawIcon(ctx, turnRight, 3 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    drawIcon(ctx, turnRight, 5 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
}