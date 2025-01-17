/** ********** *
 *
 * Sequence Sprite Animation
 *
 * ********** **/

import browserRegister from './_browserRegister.js';
import Image from './Image.js';

const component = function (opt, Easycanvas) {
    const funcOrValue = Easycanvas.utils.funcOrValue;

    // let $sprite = new Easycanvas.Sprite(opt);
    let $sprite = new Image(opt, Easycanvas);

    $sprite.index = opt.index || 0;

    $sprite.on('beforeTick', function () {
        let img = this.getImage();

        if (!img || !img.width) return;

        // 确立index
        let index = this.index || 0;
        if (index < 0) index = 0;

        // 计算每帧的宽高
        let pw, ph, wTimes;

        if (this.frameWidth) {
            const frameWidth = funcOrValue(this.frameWidth, this);

            if (frameWidth < 0) {
                pw = img.width / -frameWidth;
            } else {
                pw = frameWidth;
            }

            wTimes = Math.floor(img.width / pw);

            this.style.cutLeft = index % wTimes * pw;
        }
        if (this.frameHeight) {
            const frameHeight = funcOrValue(this.frameHeight, this);

            if (frameHeight < 0) {
                ph = img.height / -frameHeight;
            } else {
                ph = frameHeight;
            }

            let hTimes = Math.floor(img.height / ph);

            this.style.cutTop = Math.floor(index / wTimes) % hTimes * ph;
        }

        // 不循环的精灵动画自动移除
        if (!this.loop && index > 0 && this.style.cutLeft === 0 && this.style.cutTop === 0) {
            this.content.img = undefined;
            this.remove();
            return;
        }

        // 判断是否应该下一帧
        this.$lastFrameTime = this.$lastFrameTime || 0;
        if (this.$canvas.$nextTickTime - this.$lastFrameTime >= funcOrValue(this.interval, this)) {
            this.$lastFrameTime = this.$canvas.$nextTickTime;
            this.index++;
        }

        // 默认的读取和绘制尺寸等于每帧尺寸
        this.style.cutWidth = this.style.cutWidth || pw;
        this.style.cutHeight = this.style.cutHeight || ph;
        this.style.width = this.style.width || pw;
        this.style.height = this.style.height || ph;
    });

    return $sprite;
};

browserRegister(component, 'Sequence');

export default component;
