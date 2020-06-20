// https://github.com/telegramdesktop/tdesktop/blob/d506f10e9f976e23fdea9e666e32ce4ef809d371/Telegram/SourceFiles/ui/grouped_layout.cpp

// TODO should parse this properly
// шо за прикол
export class Layouter {
    constructor(sizes: Array<{ width: number, height: number }>, maxWidth: number, maxHeight: number, minWidth: number, spacing: number) {
        this.sizes = sizes

        this.ratios = this.sizes.map(q => {
            return q.width / q.height
        })

        this.count = this.ratios.length

        this.proportions = this.ratios.map(q => {
            return q > 1.2 ? "w" : (q < 0.8 ? "n" : "q")
        }).join()

        this.averageRatio = this.ratios.reduce((l, q) => {
            return l + q
        }, 1) / this.count

        this.maxSizeRatio = maxWidth / maxHeight

        this.maxWidth = maxWidth
        this.minWidth = minWidth
        this.maxHeight = maxHeight
        this.spacing = spacing
        console.log(this.ratios, this.proportions, this.averageRatio)
    }

    static getClass(size: number) {
        switch (size) {
            case 0:
                return ""
            case 1:
                return "one"
            case 2:
                return "two left"
            case 3:
                return "three left"
            case 4:
                return "four top"
            case 5:
                return "five"
            case 6:
                return "six"
            case 7:
                return "seven"
            case 8:
                return "eight"
            case 9:
                return "nine"
            case 10:
                return "ten"
        }
    }

    createLayout() {

        return
        if (this.count === 0) {
            return null
        }
        if (this.count === 1) {
            return this.layoutOne()
        }

        if (this.count >= 5) {
            return 0
        }

        if (this.count === 2) {
            return this.layoutTwo()
        }
        if (this.count === 3) {
            return this.layoutThree()
        }
        return this.layoutFour()
    }

    layoutOne() {

    }

    layoutTwo() {
        if (this.proportions === "ww" && this.averageRatio > 1.4 * this.maxSizeRatio
            && (this.ratios[1] - this.ratios[0] < 0.2)) {
            return this.layoutTwoTopBottom()
        } else if (this.proportions === "ww" || this.proportions === "qq") {
            return this.layoutTwoLeftRightEqual()
        }
        return layoutTwoLeftRight()
    }

    layoutTwoTopBottom() {

    }

    layoutTwoLeftRightEqual() {

    }

    layoutTwoLeftRight() {

    }

    layoutThree() {

    }

    layoutFour() {

    }
}