import createShadow from '../../shared/create-shadow.mjs';
import effectInit from '../../shared/effect-init.mjs';
import effectTarget from '../../shared/effect-target.mjs';
export default function EffectCustomCards({ swiper, extendParams, on }) {
  extendParams({
    customCardsEffect: {

      slideSize: 125,
      displacementX: 125,
      displacementY: -25,
      displacementRotationZ: -28,
      displacementRotationY: 60
    },
  });

  const setTranslate = () => {


    const { slides } = swiper;
    const transform = swiper.translate;
    const center = -transform;
    const params = swiper.params.customCardsEffect;

    for (let i = 0, length = slides.length; i < length; i += 1) {
      const slideEl = slides[i];
      const slideOffset = slideEl.swiperSlideOffset;
      const offsetMultiplier = (center - slideOffset ) / params.slideSize;

      let tX = 0;
      let tY = 13;
      let tZ = -150;
      let rotateY = 0;
      let rotateZ = 0;
      let scale = 1.3;
      let alpha = 1;

      let zIndex = Math.abs(Math.round(offsetMultiplier)) + 1;
      if(offsetMultiplier>0 && offsetMultiplier < 1){
        tZ = 0;
        scale = 1;
        let subProgress =0;
        if(offsetMultiplier< 0.5){
          subProgress = offsetMultiplier*2;
        }else{
          subProgress = 1 - ((offsetMultiplier-0.5)*2);
        }
        rotateY = params.displacementRotationY * subProgress;
        rotateZ = params.displacementRotationZ * subProgress;
        tX = -slideOffset - (params.displacementX * subProgress);
        tY = params.displacementY * subProgress;

      }else if(offsetMultiplier > -1 && offsetMultiplier<=0){
        tX = -slideOffset;
        if(offsetMultiplier > -0.5 &&  offsetMultiplier<0){
          tY = -16;
          tZ = 150;
          scale = 0.7;
          zIndex++;
        }
        console.log("slideOffset", slideOffset, slideEl);
      }else{
        alpha = 0;
        tX = -slideOffset;
      }
      tX = `${tX}px`;
      tY = `${tY}%`;
      tZ = `${tZ}px`;

      if (swiper.browser && swiper.browser.need3dFix) {
        if ((Math.abs(rotateY) / 90) % 2 === 1) {
          rotateY += 0.001;
        }
      }

      const transform = `
        translate3d(${tX}, ${tY}, ${tZ})
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
        scale(${scale})
      `;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
      targetEl.style.opacity = alpha;

      slideEl.style.zIndex = zIndex;


    }



  };

  const setTransition = (duration) => {
  };

  effectInit({
    effect: 'custom-cards',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode,
    }),
  });
}
