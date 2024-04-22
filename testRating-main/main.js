import '/public/styles.css'

const buttonsFilter = document.querySelector('.app__buttons')
let dataUsers
let optionDate = null
let ratings = {
    quality: 0,
    visual: 0,
    ergonomic: 0
}

async function getData() {
    await fetch('users.json')
        .then(res => {
            if (!res.ok) {
                throw new Error('Error response')
            }
            return res.json()
        })
        .then(jsonData => {
            dataUsers = jsonData.data.items
            getExpectedValue(jsonData.data.items, optionDate)
        })
        .catch(error => console.log('Ошибка - ', error))
}

function filterByDate(data, days) {
    const currentDate = new Date();
    const dayMilliseconds = +days * 24*60*60*1000
    currentDate.setTime(currentDate.getTime() - dayMilliseconds);
    
    return data.filter(item => new Date(item.created_at) >= currentDate)
}

function getExpectedValue(data, optionDate) {
    let filteredData = !optionDate ? data : filterByDate(data, optionDate)
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

    for(let key of Object.keys(ratings)) {
        ratings[key] = ratings[key]/countOfMarks
        document.querySelector(`[data-name=${key}] .app__mark`).textContent = `${ratings[key].toFixed(1)}/5`
        document.querySelector(`[data-name=${key}] .app__progress`).style = `width: ${ratings[key]/5*100}%`
        ratings[key] = 0
    }
}

function buttonsEventHandler(event){
    if(event.target.closest('.app__button')){
        buttonsFilter.querySelectorAll('.app__button').forEach(el =>{
            el.classList.remove('active')
        })
        event.target.classList.add('active')
        optionDate = Number(event.target.dataset.option)
        getExpectedValue(dataUsers, optionDate)

    }
}

buttonsFilter.addEventListener('click', buttonsEventHandler)

getData()
