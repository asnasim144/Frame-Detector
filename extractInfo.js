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
let framesCount = 0
let frameFlag = false

// window.onload = () => {
    const frameGrid = document.getElementById('frameGrid')

    // for (let i = 0; i < 150; i++) {
    //     for (let j = 0; j < 150; j++) {
    //         const cell = document.createElement('div');
    //         cell.classList.add('cell');
    //         cell.classList.add('cell');
    //         frameGrid.appendChild(cell);
    //     }
    // }
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement('td');
            cell.id = `cell-${i}-${j}`
            row.appendChild(cell);
        }
        frameGrid.appendChild(row);
    }
    console.log("grid finished")
// }

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
                        imgPixels[i].push( alphas[idx++] < 50 ? {
                            alpha: 0,
                            visited: 'notVisited'
                        } : {
                            alpha: 1,
                            visited: 'notVisited'
                        })
                    }
                }
                startingPixel = findAPixelOfAFrame(imgPixels)
                framesCount = findFrame(startingPixel)


                console.log("🚀 ~ file: extractInfo.js:41 ~ frames:", framesCount)
            }
        }
        reader.readAsDataURL(file)
    }
}

function findAPixelOfAFrame (array) {
    console.log('finding starting of a frame', count)
    for(let i=0; i < array[0].length - 1; i++) {
        for(let j=0; j < array.length - 1; j++) {
            if(array[i][j].alpha === 1 && array[i][j].visited !== 'visited') {
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
    // console.log(imgPixels[row][col])
    // console.log(currentPixel)
    if(count > 10 && row === startingPixel.row && col === startingPixel.col){
        framesCount += 1
        console.log("frames count", framesCount)
        return true
    } 
    // if(count > 150 && currentPixel === startingPixel) return 
    if(count > 3000) return false
    // console.log(currentPixel)
    if(col < imgPixels[0].length -1 && imgPixels[row][col + 1].alpha === 1) handleFindFrame({row, col: col + 1})
    if(row < imgPixels.length -1 && imgPixels[row + 1][col].alpha === 1) handleFindFrame({row: row + 1, col})
    if(col > 0 && imgPixels[row][col - 1].alpha === 1) handleFindFrame({row, col: col - 1})
    if(row > 0 && imgPixels[row - 1][col].alpha === 1) handleFindFrame({row: row - 1, col})
}
function handleFindFrame (rowColObj) {
    const { row, col } = rowColObj
    // console.log("🚀 ~ file: extractInfo.js:84 ~ handleFindFrame ~ rowColObj:", rowColObj)
    imgPixels[row][col].visited = 'visited'
    // const currentCell = document.getElementById(`cell-${i}-${j}`);
    // currentCell.classList.add('visited')
    findFrame(rowColObj)
}


// function findFrame (currentPixel) {
//     const { row, col } = currentPixel
//     console.log("🚀 ~ file: extractInfo.js:63 ~ findFrame ~ row, col:", row, col)
//     count++
//     // console.log(imgPixels[row][col])
//     // console.log(count)
//     if(count > 10 && row === startingPixel.row && col === startingPixel.col) console.log("match") 
//     // if(count > 2000) return
//     if(col < imgPixels[0].length && imgPixels[row][col + 1] === 1) findFrame({row, col: col + 1})
//     if(row < imgPixels.length - 1 && imgPixels[row + 1][col] === 1) findFrame({row: row + 1, col})
//     if(col > 0 && imgPixels[row][col - 1] === 1) findFrame({row, col: col - 1})
//     if(row > 0 && imgPixels[row - 1][col] === 1) findFrame({row: row - 1, col})
//     // else{
//     //     console.log('frame in complete')
//     // }

// }
