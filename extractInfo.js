const inputImage = document.getElementById('inputImage')
const canvas = document.getElementById('imageCanvas')
console.log("🚀 ~ file: extractInfo.js:3 ~ canvas:", canvas)
const form = document.getElementById('form')
const context = canvas.getContext('2d')
const heigth = 150
const width = 150
console.log('start')
form.onsubmit = (e) => {
    e.preventDefault()
    console.log('onsubmit')
    const file = inputImage.files[0]
    console.log(file)
    if(file){
        const reader = new FileReader()
        console.log('onsubmit')
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

                let imgPixels = []
                let idx = 0
                for(let i=0; i < heigth; i++) {
                    imgPixels.push([])
                    for(let j=0; j < width; j++) {
                        imgPixels[i].push( alphas[idx++] < 50 ? 0 : 1)
                    }
                }
                console.log(imgPixels)
            }
        }
        reader.readAsDataURL(file)
    }
}