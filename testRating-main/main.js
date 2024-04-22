import '/public/styles.css'
const qualityTrack = document.querySelector('.app__quality')
const visualTrack = document.querySelector('.app__visual')
const ergonomicTrack = document.querySelector('.app__ergonomic')
const  buttons = document.querySelector('.app__buttons')
let option = 3
let ratings = {
    quality: 0,
    visual: 0,
    ergonomic: 0
}
let data

async function getData() {
    return fetch('users.json')
        .then(res => {
            if (res.ok) {
                console.log('Получено')
                return res.json()
            }
        })
        .catch(err => {
            console.log(err)
            return null
        });
}

async function dataProcess() {
    try {
        data = await getData()
        getExpectedValue(data.data.items, option)
    } catch (err) {
        console.error(err)
    }
}

function filterByDate(data, days) {
    const currentDate = new Date();
    // const filterDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() - days);

    return data.filter(item => new Date(item.created_at) >= currentDate);
}

function getRatingByOption(data, option) {
    switch (option) {
        case 30:
            return filterByDate(data, 30);
        case 7:
            return filterByDate(data, 7);
        default:
            return data;
    }
}

function getExpectedValue(data, option) {
    let filteredData = getRatingByOption(data, option)
    console.log(filteredData);
    let countOfMarks = filteredData.length
    filteredData.forEach(el => {
        el.ratings.forEach(item => {
            switch (item.text) {
                case "качество товара":
                    ratings.quality += item.rating
                    break
                case "вид товара":
                    ratings.visual += item.rating
                    break
                case "удобство товара":
                    ratings.ergonomic += item.rating
                    break
            }

        })
    })
    ratings.quality = ratings.quality/countOfMarks
    ratings.visual = ratings.visual/countOfMarks
    ratings.ergonomic = ratings.ergonomic/countOfMarks
    qualityTrack.querySelector('.app__mark').innerHTML = `${ratings.quality.toFixed(1)}/5`
    qualityTrack.querySelector('.app__progress').style = `width: ${ratings.quality/5*100}%`
    visualTrack.querySelector('.app__mark').innerHTML = `${ratings.visual.toFixed(1)}/5`
    visualTrack.querySelector('.app__progress').style = `width: ${ratings.visual/5*100}%`
    ergonomicTrack.querySelector('.app__mark').innerHTML = `${ratings.ergonomic.toFixed(1)}/5`
    ergonomicTrack.querySelector('.app__progress').style = `width: ${ratings.ergonomic/5*100}%`
    ratings.quality = 0
    ratings.visual = 0
    ratings.ergonomic = 0
}

function buttonsEventHandler(event){
    if(event.target.closest('.app__button')){
        buttons.querySelectorAll('.app__button').forEach(el =>{
            el.classList.remove('active')
        })
        event.target.classList.add('active')
        option = Number(event.target.dataset.option)
        getExpectedValue(data.data.items, option)

    }
}

buttons.addEventListener('click', buttonsEventHandler)

await dataProcess()





