import styled from "styled-components";
import {ImageScrambler} from "./imageUtils.js";
import {useRef} from "react";

const Container = styled.div`
    display: flex;
    margin: 50px 10px;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .title {
        > h1 {
            font-size: max(3rem, 50px);
            background: linear-gradient(to right, rgba(64, 91, 254, 0.66), rgba(171, 25, 254, 0.72));
            background-clip: text; /* 适用于大多数浏览器 */
            -webkit-background-clip: text; /* 适用于 WebKit 浏览器 */
            color: transparent; /* 使文本颜色透明 */
            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
        }
    }

    .content {
        display: flex;
        gap: 40px;
        max-width: 100%;
        height: 50vw;

        align-items: center;
        //justify-content: center;
        flex-direction: column;

        .image-wrapper {
            display: flex;
            gap: 40px;
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;

            canvas {
                max-width: 100%;
                border-radius: 10px;
                width: 800px;
                //max-height: 500px;
                //height: 400px;
                border: 4px dashed rgba(142, 42, 254, 0.63);
                margin: 10px;

                &:first-child {
                    transition: .3s;
                    cursor: pointer;

                    &:hover, &.highlight {
                        background: rgba(201, 149, 249, 0.27);
                    }
                }
            }
        }

        .buttons {
            gap: 50px;
            display: flex;
            flex-wrap: wrap;

            button {
                cursor: pointer;
                transition: .3s;
                color: white;
                padding: 5px 20px;
                border-radius: 10px;
                background: rgba(138, 43, 226, 0.7);
                border: 1px solid rgba(142, 42, 254, 0.63);
                font-size: 25px;

                &:hover {
                    background: rgba(170, 85, 249, 0.7);
                    transform: translate(0, -1px);
                }
            }
        }

    }

`

export function App() {
    const inputCanvas = useRef(null);
    const outputCanvas = useRef(null);

    function loadImg(img) {
        inputCanvas.current.width = img.width;
        inputCanvas.current.height = img.height;
        outputCanvas.current.width = img.width;
        outputCanvas.current.height = img.height;
        const ctx = inputCanvas.current.getContext('2d');
        ctx.drawImage(img, 0, 0);
    }

    function loadImgFile(file) {
        if (file) {
            const img = new Image();
            img.onload = () => {
                loadImg(img)
            };
            img.src = URL.createObjectURL(file);
        }
    }

    return (
        <Container>
            <div class="title">
                <h1>MixImage</h1>
            </div>
            <div class="content">
                <div class="image-wrapper">
                    <canvas ref={inputCanvas}
                            onDragOver={(event) => event.preventDefault()}
                            onClick={() => {
                                document.querySelector('#select-file').click()
                            }}
                            onDragEnter={(e) => e.target.classList.add('highlight')}
                            onDragLeave={(e) => e.target.classList.remove('highlight')}
                            onDrop={(e) => {
                                e.preventDefault()
                                // 获取拖入的文件
                                const file = e.dataTransfer.files[0];
                                if (file && file.type.startsWith('image/')) {
                                    loadImgFile(file)
                                } else {
                                    alert('请拖入图片文件！');
                                }
                            }}
                    ></canvas>
                    <canvas ref={outputCanvas}></canvas>
                    <input type="file" accept="image/*" id={'select-file'} hidden onChange={(event) => {
                        const file = event.target.files[0];
                        loadImgFile(file)
                        event.target.value = ''
                    }}/>
                </div>
                <div class="buttons">
                    <button className={'shadow'} onClick={() => {
                        ImageScrambler.scrambleImage(inputCanvas.current, outputCanvas.current);
                    }}>加密
                    </button>
                    <button className={'shadow'} onClick={() => {
                        ImageScrambler.unscrambleImage(inputCanvas.current, outputCanvas.current);
                    }}>解密
                    </button>
                    <button className={'shadow'} onClick={() => {
                        const link = document.createElement('a');
                        link.href = outputCanvas.current.toDataURL('image/jpeg');
                        link.download = 'mix-image.jpg'; // 设置下载文件名
                        link.click();
                    }}>
                        下载图像
                    </button>
                </div>
            </div>
        </Container>
    )
}
