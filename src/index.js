import './style.css'
import p5 from 'p5'
import { clamp } from './index.js'

const 
    WIDTH = 800,
    HEIGHT = 800,
    BACKGROUND = 240,
    COLOR_PALETTE = ['#69d2e7','#a7dbd8','#e0e4cc','#f38630','#fa6900'],
    MAX = 100,
    STROKES = 100

let time = 1,
    particles = [],
    deltaX = 400,
    deltaY = 1000,
    strokeArray = [],
    palette = []

class Particle {
    constructor (x = WIDTH / 2, y = HEIGHT / 2, radius = 10, rotation) {
        this.x = x,
        this.y = y,
        this.r = radius,
        this.rotation = 0
    }

    render (p5, color, delta) {
        // let fx = p5.map(p5.noise(this.x + delta), 0, 1, 0, WIDTH)
        // let fy = p5.map(p5.noise(this.y + delta), 0, 1, 0, HEIGHT)
        p5.fill(color)
        p5.tint(255, 127);
        p5.noStroke()
        // p5.rotate(p5.sin(p5.map(p5.noise(p5.sin(delta)), 0, (this.x * this.y) / delta, 0, 0.1)))
        p5.ellipse(this.x, this.y, this.r, this.r)
    }

    rotate () {
    }
}

class Stroke {
    constructor (x, y, color) {
        this.particles = [],
        this.x = x,
        this.y = y,
        this.dx = x,
        this.dy = y,
        this.color = color
    }

    render (p5) {
        this.particles.map((particle, index) => {
            particle.render(p5, this.color, this.dx)
        })

        this.dx += 0.006
        this.dy += 0.006
    }

    addParticle (deltaX, deltaY, p5) {

        let fx = p5.map(p5.noise(this.dx), 0, 1, 0, WIDTH)
        let fy = p5.map(p5.noise(this.dy), 0, 1, 0, HEIGHT)

        let dist = Math.sqrt((fx - this.x) * (fx - this.x) + (fy - this.y) * (fy - this.y))
        
        let maxSize = (x) => {
            if (x > 15) return 15
            else return x
        }

        this.particles.push(new Particle(fx, fy, maxSize(p5.map(dist, 0, 4, 0, 10)), fx / fy * Math.PI * 2))

        this.x = fx
        this.y = fy
    }
}



const drawing = (p) => {

    p.preload = () => {
        let input = []

        for (var i = 0; i < STROKES; i++) {
            input.push("N")
        }

        console.log(input)

        const url = "http://colormind.io/api/";
        const data = {
            model : "default",
            input : input
        }

        const http = new XMLHttpRequest();

        http.onreadystatechange = () => {
            if(http.readyState == 4 && http.status == 200) {
                palette = JSON.parse(http.responseText).result

                console.log(palette)
                for (let i = 0; i < STROKES; i++) {
                    strokeArray.push(new Stroke(
                        Math.random() * 800, 
                        Math.random() * 800, 
                        palette[Math.floor(Math.random() * 5)]
                    ))
                }
            }
        }

        http.open("POST", url, true)
        http.send(JSON.stringify(data))

    }

    
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)
        p.background(BACKGROUND)


        console.log(palette)
    }

    p.draw = () => {
        // stop the animation
        if (time > MAX) p.noLoop()

        p.background(BACKGROUND)

        if ( true) {
            particles.push(new Particle(Math.random() * 800, Math.random() * 800))
        }

        for (let i = 0; i < strokeArray.length; i++) {
            strokeArray[i].addParticle(deltaX, deltaY, p)
            strokeArray[i].render(p)
        }

        time ++
        deltaX += 0.01
        deltaY += 0.01
    }
}

new p5(drawing)