import createShadow from '../../shared/create-shadow.mjs';
import effectInit from '../../shared/effect-init.mjs';
import effectTarget from '../../shared/effect-target.mjs';
export default function EffectCustomCards({ swiper, extendParams, on }) {
  extendParams({
    customCardsEffect: {

      slideSize: 125,
      displacementX: 125,
      displacementY: -25,
      displacementRotation: -28
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
      let tY = 0;
      let rotate = 0;
      let alpha = 1;
      if(offsetMultiplier>0 && offsetMultiplier < 1){

        let subProgress =0;
        if(offsetMultiplier< 0.5){
          subProgress = offsetMultiplier*2;
        }else{
          subProgress = 1 - ((offsetMultiplier-0.5)*2);
        }
        rotate = params.displacementRotation * subProgress;
        tX = -slideOffset - (params.displacementX * subProgress);
        tY = params.displacementY * subProgress;

      }else if(offsetMultiplier > -1 && offsetMultiplier<0){ 
        tX = -slideOffset;
      }else{
        alpha = offsetMultiplier == 0 ? 1 : 0;
        tX = -slideOffset;
      }
      tY = `${tY}%`;
      tX = `${tX}px`;
      const transform = `
        translate(${tX}, ${tY})
        rotateZ(${rotate}deg)
      `;
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.transform = transform;
      targetEl.style.opacity = alpha;

      slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
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
