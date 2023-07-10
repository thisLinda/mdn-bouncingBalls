// setup canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// animationFrameId tracks the animation frame ID returned by reequestAnimationFrame()
// let animationFrameId = null
let appRunning = false

const startApp = () => {
  // if (appRunning) return

  appRunning = true

  // function to generate random color
  function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`
  }

  class Ball {
    constructor(x, y, velX, velY, color, size) {
      this.x = x
      this.y = y
      this.velX = velX
      this.velY = velY
      this.color = color
      this.size = size
    }

    draw() {
      ctx.beginPath()
      ctx.fillStyle = this.color
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
      ctx.fill()
    }

    update() {
      // conditionals check if the ball has reached the edge of the canvas, if true --> reverse
      if ((this.x + this.size) >= width) {
        this.velX = -(Math.abs(this.velX))
      }

      if ((this.x - this.size) <= 0) {
        this.velX = Math.abs(this.velX)
      }

      if ((this.y + this.size) >= height) {
        this.velY = -(Math.abs(this.velY))
      }

      if ((this.y - this.size) <= 0) {
        this.velY = Math.abs(this.velY)
      }

      this.x += this.velX
      this.y += this.velY
    }

    collisionDetect() {
      // check for collision
      for (const ball of balls) {
        // check that the ball is the same ball as the one currently being checked
        if (!(this === ball)) {
          const dx = this.x - ball.x
          const dy = this.y - ball.y
          // 2d collision detection algorithm https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB()
          }
        }
      }
    }
  }

  const balls = []

  while (balls.length < 25) {
    const size = random(10, 20)
    const ball = new Ball(
      /* 
      ball position always drawn at least one ball width away from the edge of the canvas, to avoid drawing errors
      */
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    )

    balls.push(ball)
  }
  /* 
  animation loop updates the information in the balls array and renders them to the screen using requestAnimationFrame() method 
  */
  function loop() {
    // check if appRunning is true before running the animation loop otherwise app will re-render after clicking stop

    ctx.clearRect(0, 0, width, height)
    // semi-transparent to allow the trails to remain visible
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
    // draws a rectangle of the color across the whole width and height of the canvas, to cover up the previous frame's drawing and give the illusion of movement
    ctx.fillRect(0, 0, width, height)

    for (const ball of balls) {
      ball.draw()
      ball.update()
      ball.collisionDetect()
    }
    
    requestAnimationFrame(loop)
    // if (appRunning) {
    //   animationFrameId = requestAnimationFrame(loop)
    // }
  }

  // start the animation loop
  loop()
}

const stopApp = () => {
  // if (!appRunning) return

  appRunning = false
  // cancelAnimationFrame(animationFrameId)
}

document.getElementById('switch').addEventListener('click', function() {
  if (appRunning) {
    stopApp()
  } else {
    startApp()
  }
})
