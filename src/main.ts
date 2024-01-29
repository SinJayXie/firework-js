import './style.css'
import Firework from "../lib/Firework.ts";

const canvas = document.createElement('canvas')

document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas)

new Firework(canvas)