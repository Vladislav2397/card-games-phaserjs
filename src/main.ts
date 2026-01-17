import StartGame from './game/main'

console.log(`${import.meta.env.MODE} : ${__APP_VERSION__}`)

document.addEventListener('DOMContentLoaded', () => {
    StartGame('game-container')
})
