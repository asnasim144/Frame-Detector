const inputImage = document.getElementById('inputImage')
const canvas = document.getElementById('imageCanvas')
console.log("🚀 ~ file: extractInfo.js:3 ~ canvas:", canvas)
const form = document.getElementById('form')
const context = canvas.getContext('2d')
let imgPixels = []
const heigth = 150
const width = 150
let count = 0
let startingPixel = {}

form.onsubmit = (e) => {
    e.preventDefault()
    const file = inputImage.files[0]
    console.log(file)
    if(file){
        const reader = new FileReader()
        reader.onload = (event) => {
            const image = new Image()
            image.src = event.target.result
            image.onload = () => {
                // console.log(image)
                context.drawImage(image, 0, 0, width, heigth)
                const imageData = context.getImageData(0, 0, width, heigth)
                // console.log(imageData)

                let alphas = [] 
                for(let i=0; i < imageData.data.length; i+= 4){
                    alphas.push(imageData.data[i + 3])
                }
                let idx = 0
                for(let i=0; i < heigth; i++) {
                    imgPixels.push([])
                    for(let j=0; j < width; j++) {
                        imgPixels[i].push( alphas[idx++] < 50 ? 0 : 1)
                    }
                }
                startingPixel = findAPixelOfAFrame(imgPixels)
                findFrame(startingPixel)
            }
        }
        reader.readAsDataURL(file)
    }
}

function findAPixelOfAFrame (array) {
    for(let i=0; i < array[0].length; i++) {
        for(let j=0; j < array.length; j++) {
            if(array[i][j] === 1) {
                // count++
                console.log(array[i][j])
                return {
                    row: i,
                    col: j,
                }
            }
        }
    }
}

function findFrame (currentPixel) {
    const { row, col } = currentPixel
    count++
    console.log(currentPixel)
    if(count > 150 && currentPixel === startingPixel) return 
    if(count > 2000) return
    if(col < imgPixels[0].length) findFrame({row, col: col + 1})
    if(row < imgPixels.length) findFrame({row: row + 1, col})
    if(col > 0) findFrame({row, col: col - 1})
    if(row > 0) findFrame({row: row - 1, col})
}

