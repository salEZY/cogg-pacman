const canvas = document.querySelector('#myCanvas')
//const { drawBorders } = require('./helpers')
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

const ctx = canvas.getContext('2d')

let player = {
    x: 50,
    y: 100,
    pacMouth: 320,
    pacDir: 0,
    pSize: 32,
    speed: 11
}

document.addEventListener('keydown', function (event) {
    keyclick[event.code] = true;
    move(keyclick);
}, false);

document.addEventListener('keyup', function (event) {
    delete keyclick[event.code];
}, false);

function move(keyclick) {
    if (keyclick.ArrowLeft) {
        player.x -= player.speed;
        player.pacDir = 64;
    }
    if (keyclick.ArrowUp) {
        player.y -= player.speed;
        player.pacDir = 96;
    }
    if (keyclick.ArrowRight) {
        console.log('lau')
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

    if ((player.x > 350 && player.x < 360) && player.y < 100 && keyclick.ArrowRight) player.x -= player.speed
    if ((player.x > 400 && player.x < 410) && player.y < 100 && keyclick.ArrowLeft) player.x += player.speed
    if ((player.x > 350 && player.x < 398) && (player.y >= 89 && player.y < 115) && keyclick.ArrowUp) {
        player.y = 110
        console.log('da')
    }


    if (player.x < 10) {
        player.x = 10;
    }
    if (player.y < 10) {
        player.y = 10;
    }
    if (player.pacMouth == 320) {
        player.pacMouth = 352;
    } else { player.pacMouth = 320; }



}

const render = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawBorders(ctx, [
        [0, 0, 10, canvas.height], [395, 0, 10, 100], [0, 0, canvas.width, 10], [canvas.width - 10, 0, 10, canvas.height],
        [0, canvas.height - 10, 150, 10], [250, canvas.height - 10, 300, 10], [650, canvas.height - 10, 150, 10]
    ])



    let pacman = new Image()
    pacman.src = './assets/pacman.png'

    ctx.drawImage(pacman, player.pacMouth, player.pacDir, 32, 32, player.x, player.y, 50, 50);
}

const playGame = () => {
    render()
    requestAnimationFrame(playGame)
}

playGame()
