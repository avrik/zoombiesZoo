export class Enemy {
    xpos: number = 500;
    ypos: number = 0;
    constructor() {
        this.ypos = Math.floor(Math.random() * 550) +500;
    }
}
