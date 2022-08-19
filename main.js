const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')
const scoreSpan = document.querySelector('.score')
const livesSpan = document.querySelector('.lives')
const levelSpan = document.querySelector('.level')
let score = 0
let scoreToBeat = 0
let lives = 3
let level = 1
let playerX = 30
let playerY = 30
let ghostCropY = 0
let keyclick = {}
let pills = []
let ghosts = []
const player = {
    x: playerX,
    y: playerY,
    pacMouth: 320,
    pacDir: 0,
    pSize: 32,
    speed: 10
}



const collisionHandler = (player) => {
    // Border collision
    if (player.x >= (canvas.width - 58)) {
        player.x = canvas.width - 58;
    }


    if (player.y >= (canvas.height - 58)) {
        // PORTAL
        player.y += player.speed;
        if ((player.x > 165 && player.x < 210) || (player.x > 510 && player.x < 610)) {
            if (player.y > canvas.height) {
                player.x = player.x < 210 ? 580 : 180
                player.y = canvas.height - 50
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
}

const ghostMove = (ghost) => {

    const direction = Math.floor(Math.random() * 4) + 1

    if (direction === 1) ghost.y -= ghost.speed
    if (direction === 2) ghost.x += ghost.speed
    if (direction === 3) ghost.y += ghost.speed
    if (direction === 4) ghost.x -= ghost.speed
}

// Ghost array
const createGhostObjs = (ctx, characters) => {
    for (let i = 0; i < level + 1; i++) {
        let ghostY = 290 + (80 * i)
        let ghostCropX = 0 + (65 * i)
        ghosts.push({ x: 540, y: ghostY, speed: 7, eatable: false, ghostCropX, ghostCropY, sWidth: 32, sHeight: 32, dWidth: 45, dHeight: 45, ghost: true })

    }
}
createGhostObjs()

const createPillGrid = (pillsObj) => {
    pillsObj.map(pillObj => {
        for (let i = 0; i < pillObj.quantity; i++) {
            scoreToBeat += pillObj.superPill ? 100 : 10
            let superPill = pillObj.superPill ? true : false
            let obj = pillObj?.horizontal ? { x: pillObj.x + 50 * i, y: pillObj.y, superPill } : { x: pillObj.x, y: pillObj.y + 50 * i, superPill }
            pills.push(obj)
        }
    })
}

// Drawing functions
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

const drawPills = (ctx, pills) => {
    for (let i = 0; i < pills.length; i++) {
        let radius = pills[i].superPill ? 16 : 8
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(pills[i].x, pills[i].y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}


// Drawing variables
let outerWalls = [[0, 0, 10, canvas.height], [0, 0, canvas.width, 10], [canvas.width - 10, 0, 10, canvas.height]]
let portal = [[0, canvas.height - 10, 150, 10], [250, canvas.height - 10, 300, 10], [650, canvas.height - 10, 150, 10]]
let innerWalls = [[395, 0, 10, 100], [90, 90, 220, 10], [490, 90, 220, 10]]
let number1 = { moveTo: [95, 200], lineTo: [95, 500] }
let number9 = [{ moveTo: [310, 500], lineTo: [310, 200] }, { moveTo: [310, 210], lineTo: [190, 210] }, { moveTo: [190, 200], lineTo: [190, 350] }, { moveTo: [190, 340], lineTo: [310, 340] }]
let number8 = [{ moveTo: [400, 210], lineTo: [520, 210] }, { moveTo: [520, 200], lineTo: [520, 500] }, { moveTo: [520, 490], lineTo: [400, 490] }, { moveTo: [400, 500], lineTo: [400, 200] }, { moveTo: [400, 340], lineTo: [520, 340] }]
let number0 = [{ moveTo: [715, 210], lineTo: [595, 210] }, { moveTo: [715, 200], lineTo: [715, 500] }, { moveTo: [715, 490], lineTo: [595, 490] }, { moveTo: [600, 500], lineTo: [600, 400] }, { moveTo: [600, 200], lineTo: [600, 300] }, { moveTo: [600, 300], lineTo: [600, 400], strokeStyle: 'white', lineWidth: 10 }]
let superPills = [{ x: 150, y: 50, superPill: true, quantity: 1 }, { x: 270, y: 480, superPill: true, quantity: 1 }, { x: 450, y: 50, superPill: true, quantity: 1 }, { x: 560, y: 270, superPill: true, quantity: 1 }]
let smallPills = [{ x: 50, y: 150, quantity: 15, horizontal: true }, { x: 50, y: 540, quantity: 15, horizontal: true }, { x: 50, y: 200, quantity: 7 }, { x: 150, y: 200, quantity: 7 }, { x: 750, y: 200, quantity: 7 },]
let pillsObj = [...smallPills, ...superPills]
createPillGrid(pillsObj)

// Moving listeners
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
    if (keyclick.Space) {
        player.speed = 0
    }

    // Player collision
    collisionHandler(player)

    // Pill detection
    pills.map(pill => {
        if (player.x <= pill.x && pill.x <= (player.x + 32) && player.y <= pill.y && pill.y <= (player.y + 32)) {
            pill.x = -20
            pill.y = -20
            if (pill.superPill) {
                score += 100
                ghostCropY = 32
            } else
                score += 10
        }
    })

    // Ghost collision
    ghosts.map(ghost => {
        if (player.x <= (ghost.x + 26) && ghost.x <= (player.x + 26) && player.y <= (ghost.y + 26) && ghost.y <= (player.y + 32)) {
            lives -= 1
            player.x = playerX;
            player.y = playerY;
        }
    })


    // Open/closed mouth
    if (player.pacMouth == 320) {
        player.pacMouth = 352;
    } else { player.pacMouth = 320; }



}

const render = () => {
    scoreSpan.innerHTML = score
    livesSpan.innerHTML = lives
    levelSpan.innerHTML = level
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    drawBorders(ctx, [...outerWalls, ...portal, ...innerWalls])

    drawNumbers(ctx, [number1])
    drawNumbers(ctx, number9)
    drawNumbers(ctx, number8)
    drawNumbers(ctx, number0)

    drawPills(ctx, pills)



    let characters = new Image()
    characters.src = './assets/pacman.png'

    // Draw Pacman
    ctx.drawImage(characters, player.pacMouth, player.pacDir, 32, 32, player.x, player.y, 50, 50);

    // Draw Ghosts
    ghosts.map(ghost => {
        ctx.drawImage(characters, ghost.ghostCropX, ghost.ghostCropY, ghost.sWidth, ghost.sHeight, ghost.x, ghost.y, ghost.dWidth, ghost.dHeight)
        ghostMove(ghost)
        collisionHandler(ghost)
    })
    // Draw Eyes
    ctx.drawImage(characters, 380, 65, 32, 32, 627, 250, 50, 50)
    console.log(scoreToBeat)
    // Next level
    if (score === scoreToBeat) {
        pills = []
        ghosts = []
        level += 1
        levelSpan.innerHTML = level
        score = 0
        scoreToBeat = 0
        player.x = playerX
        player.y = playerX
        createPillGrid(pillsObj)
        drawPills(ctx, pills)
        createGhostObjs()
    }
}

const playGame = () => {
    render()
    requestAnimationFrame(playGame)
}


playGame()
