export interface CustomCoverflowEffectMethods {}

export interface CustomCoverflowEffectEvents {}

export interface CustomCoverflowEffectOptions {
  /**
   * Enables slides shadows
   *
   * @default true
   */
  slideShadows?: boolean;
  /**
   * Slide rotate in degrees. If the index of the slide is bigger than the of elements of the array then it will take the last one
   *
   * @default [0,75,80,85,90]
   */
  rotate?: number[];
  /**
   * Stretch space between slides (in px) on each index. If the index of the slide is bigger than the of elements of the array then it will take the last one
   *
   * @default [0,15,60 ]
   */
  stretch?: number[];
  /**
   * Depth offset in px (slides translate in Z axis)
   *
   * @default 100
   */
  depth?: number;
  /**
   * Slide scale effect
   *
   * @default 1
   */
  scale?: number;
  /**
   * Effect multiplier
   *
   * @default 1
   */
  modifier?: number;

  /**
   * item element size in px
   *
   * @default 125
   */
  itemSize?:number
}
