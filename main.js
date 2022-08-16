const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')

let keyclick = {}

const drawBorders = (ctx, arr) => {
    arr.forEach(elem => {
        ctx.beginPath();
        ctx.lineWidth = "10";
        ctx.strokeStyle = "blue";
        ctx.rect(...elem);
        ctx.stroke()
    })
}

const drawNumbers = (ctx, arr) => {
    arr.forEach(elem => {
        ctx.beginPath();
        ctx.lineWidth = elem.lineWidth ? elem.lineWidth : "20";
        ctx.strokeStyle = elem.strokeStyle ? elem.strokeStyle : "blue";
        ctx.moveTo(...elem.moveTo)
        ctx.lineTo(...elem.lineTo)
        ctx.stroke()
    })
}

const drawPellets = (ctx, pill) => {
    ctx.fillStyle = "white";
    let radius = pill.super ? 24 : 12
    pill.quantity.map(elem => {
        ctx.beginPath();
        ctx.arc(x + 50, pill.y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    })
}

const player = {
    x: 30,
    y: 30,
    pacMouth: 320,
    pacDir: 0,
    pSize: 32,
    speed: 11
}

const pills = [{ x: 20, y: 130, quantity: 10 }]

let outerWalls = [[0, 0, 10, canvas.height], [0, 0, canvas.width, 10], [canvas.width - 10, 0, 10, canvas.height]]
let portal = [[0, canvas.height - 10, 150, 10], [250, canvas.height - 10, 300, 10], [650, canvas.height - 10, 150, 10]]
let innerWalls = [[395, 0, 10, 100], [90, 90, 220, 10], [490, 90, 220, 10]]
let number1 = { moveTo: [95, 200], lineTo: [95, 500] }
let number9 = [{ moveTo: [310, 500], lineTo: [310, 200] }, { moveTo: [310, 210], lineTo: [190, 210] }, { moveTo: [190, 200], lineTo: [190, 350] }, { moveTo: [190, 340], lineTo: [310, 340] }]
let number8 = [{ moveTo: [400, 210], lineTo: [520, 210] }, { moveTo: [520, 200], lineTo: [520, 500] }, { moveTo: [520, 490], lineTo: [400, 490] }, { moveTo: [400, 500], lineTo: [400, 200] }, { moveTo: [400, 340], lineTo: [520, 340] }]
let number0 = [{ moveTo: [715, 210], lineTo: [595, 210] }, { moveTo: [715, 200], lineTo: [715, 500] }, { moveTo: [715, 490], lineTo: [595, 490] }, { moveTo: [600, 500], lineTo: [600, 400] }, { moveTo: [600, 200], lineTo: [600, 300] }, { moveTo: [600, 300], lineTo: [600, 400], strokeStyle: 'white', lineWidth: 10 }]


document.addEventListener('keydown', function (event) {
    keyclick[event.code] = true;
    move(keyclick);
}, false);

document.addEventListener('keyup', function (event) {
    delete keyclick[event.code];
}, false);

const move = (keyclick) => {
    // Moving
    if (keyclick.ArrowLeft) {
        player.x -= player.speed;
        player.pacDir = 64;
    }
    if (keyclick.ArrowUp) {
        player.y -= player.speed;
        player.pacDir = 96;
    }
    if (keyclick.ArrowRight) {
        player.x += player.speed;
        player.pacDir = 0;
    }
    if (keyclick.ArrowDown) {
        player.y += player.speed;
        player.pacDir = 32;
    }

    // if (13 in keyclick) {
    //     pauseGame();
    // }


    // Border collision
    if (player.x >= (canvas.width - 58)) {
        player.x = canvas.width - 58;
    }
    console.log(player.x, player.y)

    if (player.y >= (canvas.height - 58)) {
        // PORTAL
        player.y += player.speed;
        if ((player.x > 165 && player.x < 210) || (player.x > 510 && player.x < 610)) {
            if (player.y > canvas.height) {
                player.x = player.x < 210 ? 580 : 180
                player.y = canvas.height - 48
                player.pacDir = 96
            }
        }
        else {
            player.y = canvas.height - 58;
        }
    }

    if (player.x < 10) {
        player.x = 10;
    }
    if (player.y < 10) {
        player.y = 10;
    }

    // Maze collision
    if ((player.x > 345 && player.x < 360) && player.y < 100 && keyclick.ArrowRight) player.x -= player.speed
    if ((player.x > 400 && player.x < 410) && player.y < 100 && keyclick.ArrowLeft) player.x += player.speed
    if ((player.x > 350 && player.x < 398) && (player.y >= 89 && player.y < 115) && keyclick.ArrowUp) player.y += player.speed
    if ((player.x > 35 && player.x < 105) && (player.y > 155 && player.y < 495)) {
        if (keyclick.ArrowRight) player.x -= player.speed
        if (keyclick.ArrowLeft) player.x += player.speed
    }
    if ((player.x >= 50 && player.x < 95)) {
        if (player.y > 50 && player.y < 100) player.x -= player.speed
        if (player.y > 145 && player.y < 160) player.y -= player.speed
        if ((player.y > 480 && player.y < 520) && keyclick.ArrowUp) player.y += player.speed
    }

    if (player.x >= 300 && player.x < 325) {
        if ((player.y > 55 && player.y < 100) || (player.y > 165 && player.y < 490)) player.x += player.speed
    }
    if ((player.x > 130 && player.x < 145) && (player.y > 155 && player.y < 340)) player.x -= player.speed
    if (player.x > 155 && player.x < 310) {
        if (player.y > 145 && player.y < 160) player.y -= player.speed
        if (player.y > 340 && player.y < 355) player.y = player.y += player.speed
    }
    if ((player.x > 245 && player.x < 270) && (player.y > 350 && player.y < 480)) player.x -= player.speed
    if ((player.x > 260 && player.x < 315) && (player.y > 470 && player.y < 500)) player.y += player.speed
    if ((player.y > 35 && player.y < 55) || (player.y > 90 && player.y < 110)) {
        if ((player.x > 50 && player.x < 300) || (player.x >= 450 && player.x < 705)) {
            if (keyclick.ArrowUp) player.y += player.speed
            if (keyclick.ArrowDown) player.y -= player.speed
            if (keyclick.ArrowLeft) player.x -= player.speed
        }
    }
    if ((player.y > 55 && player.y < 100) && (player.x > 435 && player.x < 705)) {
        if (keyclick.ArrowRight) player.x -= player.speed
        if (keyclick.ArrowLeft) player.x += player.speed
    }

    if (player.y > 170 && player.y < 480) {
        if ((player.x >= 710 && player.x < 725) || (player.x >= 520 && player.x < 540)) player.x += player.speed
        if ((player.x >= 545 && player.x < 560) || (player.x > 345 && player.x < 360)) player.x -= player.speed
    }
    if ((player.x > 355 && player.x < 525) || (player.x > 550 && player.x < 720)) {
        if (player.y > 475 && player.y < 500) player.y += player.speed
        if (player.y > 160 && player.y < 170) player.y -= player.speed
    }


    // Open/closed mouth
    if (player.pacMouth == 320) {
        player.pacMouth = 352;
    } else { player.pacMouth = 320; }



}

const render = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawBorders(ctx, [...outerWalls, ...portal, ...innerWalls])

    drawNumbers(ctx, [number1])
    drawNumbers(ctx, number9)
    drawNumbers(ctx, number8)
    drawNumbers(ctx, number0)

    let pacman = new Image()
    pacman.src = './assets/pacman.png'

    ctx.drawImage(pacman, player.pacMouth, player.pacDir, 32, 32, player.x, player.y, 50, 50);
}

const playGame = () => {
    render()
    requestAnimationFrame(playGame)
}

playGame()
