import createShadow from '../../shared/create-shadow.mjs';
import effectInit from '../../shared/effect-init.mjs';
import effectTarget from '../../shared/effect-target.mjs';
import { getSlideTransformEl } from '../../shared/utils.mjs';

export default function EffectCustomCoverflow({ swiper, extendParams, on }) {
  extendParams({
    customCoverflowEffect: {
      rotate: [0,75,85],
      stretch: [0,28,76,84,84,88,92],
      itemSize:125,
      depth: 0,
      scale: 1,
      modifier: 1,
      slideShadows: false,
    },
  });

  const setTranslate = () => {
    const { width: swiperWidth, height: swiperHeight, slides, slidesSizesGrid } = swiper;
    const params = swiper.params.customCoverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;

    let rotate = isHorizontal ? params.rotate : params.rotate.map(e=>e*-1);
    const translate = params.depth;
    // Each slide offset from center
    for (let i = 0, length = slides.length; i < length; i += 1) {
      const slideEl = slides[i];
      const slideSize = slidesSizesGrid[i];
      const slideOffset = slideEl.swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier =
        typeof params.modifier === 'function'
          ? params.modifier(centerOffset)
          : centerOffset * params.modifier;

      let rotateIndex = Math.ceil(Math.abs(offsetMultiplier));
      let power = Math.abs(offsetMultiplier % 1);
      if(power == 0){
        rotateIndex++;
      }
      if(rotateIndex  >= rotate.length){
        power = 1;
        rotateIndex = rotate.length -1
      }


      let rotateS =rotate[Math.max(rotateIndex-1,0)];
      let rotateF =rotate[rotateIndex];
        let rotateValue = ((rotateF - rotateS)  * power) + rotateS;

      rotateValue = rotateValue *(offsetMultiplier>0?1:-1);


      let rotateY = isHorizontal ?rotateValue : 0;



      let rotateX = isHorizontal ? 0 : rotateValue;
      // var rotateZ = 0
      let translateZ = -translate * Math.abs(offsetMultiplier);

      let stretch = params.stretch.map((e)=>params.itemSize*(e/100));
      let stretchIndexBefore = Math.floor(Math.abs(offsetMultiplier));
      let stretchIndexAfter = Math.ceil(Math.abs(offsetMultiplier));
      let stretchPower = Math.abs(offsetMultiplier )-stretchIndexBefore;

      let stretchDeltaCount =0;
      for(let s=0; s<= stretchIndexBefore;s++){
        stretchDeltaCount+=stretch[s>=stretch.length?stretch.length -1:s];
      }


      let stretchValue = 0;
      if(stretchIndexAfter  >= stretch.length){
        stretchIndexAfter = stretch.length -1
      }

      let stretchF =stretch[stretchIndexAfter];
      let stretchEnd = stretchF * stretchPower;

      stretchValue = stretchDeltaCount + stretchEnd;

      stretchValue = stretchValue *(offsetMultiplier>0?1:-1);

      let translateY = isHorizontal ? 0 : stretchValue;
      let translateX = isHorizontal ? stretchValue : 0;


      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);

      // Fix for ultra small values
      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;

      if (swiper.browser && swiper.browser.need3dFix) {
        if ((Math.abs(rotateY) / 90) % 2 === 1) {
          rotateY += 0.001;
        }
        if ((Math.abs(rotateX) / 90) % 2 === 1) {
          rotateX += 0.001;
        }
      }
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = slideTransform;

      slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

      if (params.slideShadows) {
        // Set shadows
        let shadowBeforeEl = isHorizontal
          ? slideEl.querySelector('.swiper-slide-shadow-left')
          : slideEl.querySelector('.swiper-slide-shadow-top');
        let shadowAfterEl = isHorizontal
          ? slideEl.querySelector('.swiper-slide-shadow-right')
          : slideEl.querySelector('.swiper-slide-shadow-bottom');
        if (!shadowBeforeEl) {
          shadowBeforeEl = createShadow('coverflow', slideEl, isHorizontal ? 'left' : 'top');
        }
        if (!shadowAfterEl) {
          shadowAfterEl = createShadow('coverflow', slideEl, isHorizontal ? 'right' : 'bottom');
        }
        if (shadowBeforeEl)
          shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if (shadowAfterEl)
          shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };
  const setTransition = (duration) => {
    const transformElements = swiper.slides.map((slideEl) => getSlideTransformEl(slideEl));

    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
      el.querySelectorAll(
        '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left',
      ).forEach((shadowEl) => {
        shadowEl.style.transitionDuration = `${duration}ms`;
      });
    });
  };

  effectInit({
    effect: 'custom-coverflow',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
    }),
  });
}
