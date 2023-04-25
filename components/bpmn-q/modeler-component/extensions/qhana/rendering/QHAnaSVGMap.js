import * as qhanaConsts from '../QHAnaConstants';

export function getSVG(svgId) {

  // to insert svgs easily just open them in your browser, copy the outer html and insert it using ctrl + alt + shift + v in intellij to avoid formatting,escaping etc.
  // matrix( Scalingfactor, 0, 0, Scalingfactor, shift X, shift y)
  // IMPORTANT: ensure that definition Ids for new SVGs are UNIQUE
  // viewbox is not required
  const svgMap = {
    [qhanaConsts.TASK_TYPE_QHANA_SERVICE_TASK]: {
      transform: 'matrix(0.17, 0, 0, 0.17, 7, 7)',
      svg: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 121.7 122.88"><title>diagnostic-analysis</title><path d="M17.67,53.08h8.22l6.82-13.82L45.14,57.17l12.7-24.75,13.26,26,4.54-4.16,3-1.18H89.56v.53a35.81,35.81,0,0,1-1,8.35H80.35L68.5,72.84l-10.7-21L46.28,74.33,34,56.65,31.39,62H18.63a36.35,36.35,0,0,1-1-8.35v-.53ZM53.61,0A53.63,53.63,0,0,1,98.49,83l23.21,25.29-16,14.63L83.31,98.26A53.62,53.62,0,1,1,53.61,0Zm29.6,24a41.81,41.81,0,1,0,12.28,29.6A41.77,41.77,0,0,0,83.21,24Z"/></svg>'
    },
    [qhanaConsts.TASK_TYPE_QHANA_SERVICE_STEP_TASK]: {
      transform: 'matrix(0.14, 0, 0, 0.14, 4, 4)',
      svg: '<svg width="177" height="156" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="562" y="284" width="177" height="156"/></clipPath><clipPath id="clip1"><rect x="579" y="298" width="122" height="123"/></clipPath><clipPath id="clip2"><rect x="579" y="298" width="122" height="123"/></clipPath><clipPath id="clip3"><rect x="579" y="298" width="122" height="123"/></clipPath></defs><g clip-path="url(#clip0)" transform="translate(-562 -284)"><g clip-path="url(#clip1)"><g clip-path="url(#clip2)"><g clip-path="url(#clip3)"><path d="M596.778 351.132 605.006 351.132 611.833 337.298 624.275 355.226 636.987 330.452 650.26 356.477 654.804 352.313 657.807 351.132 668.738 351.132 668.738 351.662C668.734 354.478 668.398 357.283 667.737 360.021L659.519 360.021 647.657 370.911 636.947 349.891 625.416 372.403 613.124 354.705 610.511 360.061 597.739 360.061C597.083 357.323 596.747 354.518 596.738 351.702L596.738 351.172ZM632.753 298C662.401 297.996 686.438 322.027 686.442 351.675 686.444 362.121 683.397 372.341 677.677 381.081L700.909 406.396 684.894 421.04 662.482 396.356C637.804 412.777 604.486 406.084 588.065 381.406 571.643 356.728 578.336 323.41 603.014 306.989 611.824 301.126 622.171 297.999 632.753 298ZM662.382 322.023C646.019 305.699 619.521 305.729 603.196 322.092 586.871 338.454 586.902 364.953 603.264 381.278 619.627 397.603 646.125 397.572 662.45 381.209 670.277 373.364 674.673 362.735 674.674 351.652 674.679 340.535 670.255 329.873 662.382 322.023Z"/></g></g></g><path d="M568.5 290.5 698.5 290.5 732.5 362.5 698.5 434.5 568.5 434.5Z" stroke="#000000" stroke-width="10.6667" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>'
    }
  };

  return svgMap[svgId];
}