class XorRandom {
    constructor(seed) {
        this.seed = seed;
    }

    nextInt(max = 2147483647) {
        this.seed = this.seed ^ (this.seed << 13);
        this.seed = this.seed ^ (this.seed >> 17);
        this.seed = this.seed ^ (this.seed << 5);
        return Math.abs(this.seed) % max;
    }
}

// 图像混淆器对象
export const ImageScrambler = {
    SEED: 1, // 固定种子确保混淆和还原一致

    // 计算块大小
    calculateBlockSize(width, height) {
        return Math.floor((width + height) / 50);
    },

    // 生成块坐标列表
    generateBlockPositions(blocksX, blocksY) {
        const positions = [];
        for (let y = 0; y < blocksY; y++) {
            for (let x = 0; x < blocksX; x++) {
                positions.push([x, y]);
            }
        }
        return positions;
    },

    // Fisher-Yates 洗牌
    shuffleList(list, seed) {
        const result = [...list];
        const random = new XorRandom(seed);
        for (let i = result.length - 1; i > 0; i--) {
            const j = random.nextInt(i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    // 处理图像混淆或还原
    processImage(inputCanvas, outputCanvas, blockSize, isScramble, progressCallback) {
        const width = inputCanvas.width;
        const height = inputCanvas.height;
        const blocksX = Math.floor(width / blockSize);
        const blocksY = Math.floor(height / blockSize);

        const ctx = outputCanvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        const positions = this.generateBlockPositions(blocksX, blocksY);
        const shuffledPositions = this.shuffleList(positions, this.SEED);

        positions.forEach((pos, index) => {
            const progress = Math.floor((index / positions.length) * 100);
            progressCallback?.(progress);

            const srcPos = isScramble ? pos : shuffledPositions[index];
            const destPos = isScramble ? shuffledPositions[index] : pos;

            const srcX = srcPos[0] * blockSize;
            const srcY = srcPos[1] * blockSize;
            const destX = destPos[0] * blockSize;
            const destY = destPos[1] * blockSize;

            ctx.drawImage(
                inputCanvas,
                srcX, srcY, blockSize, blockSize,
                destX, destY, blockSize, blockSize
            );
        });
    },

    // 混淆图像
    scrambleImage(inputCanvas, outputCanvas, progressCallback) {
        const blockSize = this.calculateBlockSize(inputCanvas.width, inputCanvas.height);
        this.processImage(inputCanvas, outputCanvas, blockSize, true, progressCallback);
        invertColor(outputCanvas)
    },

    // 还原图像
    unscrambleImage(inputCanvas, outputCanvas, progressCallback) {
        const blockSize = this.calculateBlockSize(inputCanvas.width, inputCanvas.height);
        this.processImage(inputCanvas, outputCanvas, blockSize, false, progressCallback);
        invertColor(outputCanvas)
    }
}

function invertColor(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}