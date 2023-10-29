/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export function getQuantMESVG(svgId) {
  // to insert svgs easily just open them in your browser, copy the outer html and insert it using ctrl + alt + shift + v in intellij to avoid formatting,escaping etc.
  // matrix( Scalingfactor, 0, 0, Scalingfactor, shift X, shift y)
  // IMPORTANT: ensure that definition Ids for new SVGs are UNIQUE
  // viewbox is not required
  const quantMESVGMap = {
    TASK_TYPE_QUANTUM_COMPUTATION: { svg: "" },
    TASK_TYPE_CIRCUIT_LOADING: { svg: "" },
    TASK_TYPE_DATA_PREPARATION: { svg: "" },
    TASK_TYPE_ORACLE_EXPANSION: { svg: "" },
    TASK_TYPE_CIRCUIT_EXECUTION: { svg: "" },
    TASK_TYPE_ERROR_MITIGATION: {
      transform: "matrix(0.2, 0, 0, 0.2, 5, 5)",
      svg: '<svg width="246" height="97" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="0" y="0" width="246" height="97"/></clipPath></defs><g clip-path="url(#clip0)"><rect x="0" y="0" width="246" height="97.0353" fill="#FFFFFF"/><path d="M11.1176 3.00106 2.99997 3.00106 2.99997 94.0342 95 94.0342 95 86.0019 11.1176 86.0019Z" fill-rule="evenodd"/><path d="M19 48.0174 34 48.0174 34 78.0284 19 78.0284Z" fill-rule="evenodd"/><path d="M40 29.0106 54 29.0106 54 78.0284 40 78.0284Z" fill-rule="evenodd"/><path d="M60 53.0193 75 53.0193 75 78.0284 60 78.0284Z" fill-rule="evenodd"/><path d="M79.9999 68.0247 95 68.0247 95 78.0284 79.9999 78.0284Z" fill-rule="evenodd"/><path d="M159.118 3.00106 151 3.00106 151 94.0342 243 94.0342 243 86.0019 159.118 86.0019Z" fill-rule="evenodd"/><path d="M167 63.0229 182 63.0229 182 78.0284 167 78.0284Z" fill-rule="evenodd"/><path d="M187 3.00106 202 3.00106 202 78.0284 187 78.0284Z" fill-rule="evenodd"/><path d="M207 68.0247 222 68.0247 222 78.0284 207 78.0284Z" fill-rule="evenodd"/><path d="M228 69.0251 242 69.0251 242 78.0283 228 78.0283Z" fill-rule="evenodd"/><path d="M101.5 44.0099 130.207 44.01 130.207 53.0255 101.5 53.0254ZM125.701 34.9945 143.726 48.5178 125.701 62.041Z"/></g></svg>',
    },
    SUBPROCESS_QUANTUM_HARDWARE_SELECTION: { svg: "" },
    TASK_TYPE_WARM_STARTING: {
      transform: "matrix(0.22, 0, 0, 0.22, 3, 3)",
      viewBox: "0 0 189 98",
      svg: '<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip1761"><rect x="0" y="0" width="189" height="98"/></clipPath><linearGradient x1="4.78078" y1="73.0398" x2="109.526" y2="59.4026" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="fill1"><stop offset="0" stop-color="#404040"/><stop offset="0.5" stop-color="#A6A6A6"/><stop offset="0.85" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient></defs><g clip-path="url(#clip1761)"><rect x="0" y="0" width="189" height="97.6678" fill="#FFFFFF"/><path d="M112.928 85.3564C102.932 88.8593 92.9369 92.3624 82.9621 91.8997 72.9874 91.437 62.5388 84.6075 53.0801 82.5807 43.6214 80.5539 27.2551 80.8354 26.2101 79.7385 25.1651 78.6416 38.9868 76.1377 46.8098 75.9998 54.6328 75.8618 65.7363 79.4358 73.1481 78.9112 80.56 78.3866 87.8312 75.4144 91.2806 72.8518 94.73 70.2892 94.2284 65.7753 93.8447 63.5355 93.4611 61.2958 91.9253 59.2062 88.9783 59.4137 86.0313 59.6212 80.071 63.6557 76.1628 64.7809 72.2545 65.9061 69.3302 66.2868 65.529 66.1654 61.7277 66.0439 58.0924 65.8126 53.3551 64.0517 48.6178 62.2908 45.5989 57.1358 37.1058 55.5997 28.6127 54.0636 2.79869 55.8393 2.39665 54.8349 1.99461 53.8305 26.1071 50.0748 34.6935 49.5732 43.28 49.0717 48.0741 51.2656 53.9156 51.826 59.7571 52.3864 64.8013 53.0506 69.7432 52.9356 74.6851 52.8206 81.6538 52.3537 83.5671 51.1358 85.4805 49.9179 84.3629 46.8932 81.223 45.6289 78.0831 44.3645 70.0396 44.8834 64.7275 43.5495 59.4154 42.2155 48.3664 38.3703 49.3504 37.6258 50.3343 36.8813 63.8488 38.9085 70.6311 39.0822 77.4134 39.2559 90.0443 38.6682 90.0443 38.6682L90.0443 38.6682 90.0443 38.6682 90.0443 38.6682" stroke="#000000" stroke-width="1.33326" stroke-miterlimit="8" fill="url(#fill1)" fill-rule="evenodd"/><path d="M0 16.4818C-5.53964e-15 7.37914 19.4809-2.09835e-15 43.5118-4.1967e-15 67.5428-8.3934e-15 87.0237 7.37914 87.0237 16.4818 87.0237 25.5844 67.5428 32.9635 43.5118 32.9635 19.4809 32.9635-2.76982e-14 25.5844 0 16.4818Z" stroke="#000000" stroke-width="1.32994" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.868236 -0.499577 -0.501276 -0.865292 108.737 84.9993)"/><path d="M0 16.4818C-5.53964e-15 7.37914 19.4809-2.09835e-15 43.5118-4.1967e-15 67.5428-8.3934e-15 87.0237 7.37914 87.0237 16.4818 87.0237 25.5844 67.5428 32.9635 43.5118 32.9635 19.4809 32.9635-2.76982e-14 25.5844 0 16.4818Z" stroke="#000000" stroke-width="1.32994" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.868236 0.499577 0.501276 -0.865292 92.617 41.5246)"/><path d="M0 15.4475C-5.96344e-15 6.91606 20.9713-1.96667e-15 46.8407-3.93334e-15 72.7101-7.86667e-15 93.6814 6.91606 93.6814 15.4475 93.6814 23.9789 72.7101 30.8949 46.8407 30.8949 20.9713 30.8949-2.98172e-14 23.9789 0 15.4475Z" stroke="#000000" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(6.14406e-17 1 1.0034 -6.12323e-17 122.5 2.49153)"/><path d="M129.5 49.3323C129.5 44.929 133.306 41.3594 138 41.3594 142.694 41.3594 146.5 44.929 146.5 49.3323 146.5 53.7356 142.694 57.3051 138 57.3051 133.306 57.3051 129.5 53.7356 129.5 49.3323Z" stroke="#000000" stroke-width="1.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M0 0 29.576 0.000104631" stroke="#595959" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1.0034 0 0 1 90.1767 30.3967)"/><path d="M0 0 29.576 0.000104631" stroke="#595959" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1.0034 0 0 1 78.1767 22.4238)"/><path d="M0 0 29.576 0.000104631" stroke="#595959" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1.0034 0 0 1 91.1767 13.4543)"/><path d="M0 0 29.576 0.000104631" stroke="#595959" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1.0034 0 0 1 103.177 5.48141)"/></g></svg>',
    },
    SUBPROCESS_TYPE_CIRCUIT_CUTTING: {
      transform: "matrix(0.23, 0, 0, 0.23, 4, 3)",
      viewBox: "0 0 144 144",
      svg: '<svg width="144" height="144" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip2675673"><rect x="0" y="0" width="144" height="144"/></clipPath><clipPath id="clip2675674"><rect x="28" y="-8" width="122" height="122"/></clipPath><clipPath id="clip2675"><rect x="28" y="-8" width="122" height="122"/></clipPath><clipPath id="clip2676"><rect x="28" y="-8" width="122" height="122"/></clipPath></defs><g clip-path="url(#clip2675673)"><rect x="0" y="0" width="144" height="144" fill="#FFFFFF"/><path d="M2.49996 56.5 132.804 56.5001" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M2.49996 90.5 132.804 90.5001" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M2.49996 127.5 132.804 127.5" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M36.5 46.5 36.6336 141.817" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M22.5 128C22.5 119.992 28.9918 113.5 37 113.5 45.0081 113.5 51.5 119.992 51.5 128 51.5 136.008 45.0081 142.5 37 142.5 28.9918 142.5 22.5 136.008 22.5 128Z" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M26.5 56C26.5 50.7533 30.9771 46.5 36.5 46.5 42.0228 46.5 46.5 50.7533 46.5 56 46.5 61.2467 42.0228 65.5 36.5 65.5 30.9771 65.5 26.5 61.2467 26.5 56Z" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill-rule="evenodd"/><path d="M87.5 91C87.5 82.9919 93.9919 76.5 102 76.5 110.008 76.5 116.5 82.9919 116.5 91 116.5 99.0081 110.008 105.5 102 105.5 93.9919 105.5 87.5 99.0081 87.5 91Z" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M92.5 127.5C92.5 121.977 96.7533 117.5 102 117.5 107.247 117.5 111.5 121.977 111.5 127.5 111.5 133.023 107.247 137.5 102 137.5 96.7533 137.5 92.5 133.023 92.5 127.5Z" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill-rule="evenodd"/><path d="M102.5 76.5 102.5 137.318" stroke="#000000" stroke-width="1.00232" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><g clip-path="url(#clip2675674)"><g clip-path="url(#clip2675)"><g clip-path="url(#clip2676)"><path d="M123.792 52.2395C119.632 52.2395 116.229 48.8364 116.229 44.677 116.229 40.5177 119.632 37.1145 123.792 37.1145 127.951 37.1145 131.354 40.5177 131.354 44.677 131.354 48.8364 127.951 52.2395 123.792 52.2395ZM94.424 25.2666C90.5167 23.7541 88.7521 19.3427 90.2646 15.4354 91.7771 11.5281 96.1886 9.7635 100.096 11.276 104.003 12.7885 105.768 17.2 104.255 21.1073 102.743 24.8885 98.3313 26.7791 94.424 25.2666ZM91.0209 54.7604C88.8782 54.7604 87.2396 53.1218 87.2396 50.9791 87.2396 48.8364 88.8782 47.1979 91.0209 47.1979 93.1636 47.1979 94.8021 48.8364 94.8021 50.9791 94.8021 53.1218 93.1636 54.7604 91.0209 54.7604ZM123.792 29.552C120.515 29.552 117.49 30.5604 114.969 32.325L102.743 39.1312 109.549 26.9052C110.179 25.8968 110.809 24.8885 111.314 23.7541 114.465 16.0656 110.683 7.24267 102.995 4.09163 95.3063 0.940588 86.4834 4.72184 83.3323 12.4104 80.1813 20.0989 83.9625 28.9218 91.6511 32.0729 93.1636 32.7031 94.6761 32.9552 96.1886 33.0812L84.8448 44.425 82.0719 50.601 45.6459 71.1458 38.0834 83.7499 74.6355 67.3645 58.25 103.917 70.8542 96.3541 91.1469 60.0541 97.3229 57.2812 108.667 45.9375C109.297 53.752 115.851 59.802 123.792 59.802 132.11 59.802 138.917 52.9958 138.917 44.677 138.917 36.3583 132.11 29.552 123.792 29.552Z"/></g></g></g></g></svg>',
    },
    TASK_TYPE_PARAMETER_OPTIMIZATION: {
      transform: "matrix(0.22, 0, 0, 0.22, 4, 3)",
      viewBox: "0 0 125 113",
      svg: '<svg width="125" height="113" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip3576"><rect x="0" y="0" width="125" height="113"/></clipPath></defs><g clip-path="url(#clip3576)"><rect x="0" y="0" width="125" height="113.362" fill="#FFFFFF"/><path d="M4.69955 5.46922C3.56154 5.74168 2.42368 6.01413 5.38224 17.8955 8.3408 29.7769 13.5755 63.6769 22.4513 76.7573 31.3272 89.8377 46.0066 105.098 58.6376 96.3779 71.2687 87.6577 87.4274 39.1511 98.2378 24.4357 109.048 9.72032 116.274 8.90281 123.5 8.0853" stroke="#404040" stroke-width="3.00802" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M97 14.916C97 9.42408 101.253 4.972 106.5 4.972 111.747 4.972 116 9.42408 116 14.916 116 20.4079 111.747 24.86 106.5 24.86 101.253 24.86 97 20.4079 97 14.916Z" fill-rule="evenodd"/><path d="M71 58.6696C71 53.1776 75.4772 48.7256 81 48.7256 86.5229 48.7256 91 53.1776 91 58.6696 91 64.1615 86.5229 68.6136 81 68.6136 75.4772 68.6136 71 64.1615 71 58.6696Z" fill-rule="evenodd"/><path d="M43 100.932C43 95.7143 47.4772 91.4848 53 91.4848 58.5229 91.4848 63 95.7143 63 100.932 63 106.149 58.5229 110.378 53 110.378 47.4772 110.378 43 106.149 43 100.932Z" fill-rule="evenodd"/><path d="M0.148817-1.48817 2.16357-1.28669 4.28945-0.626936 8.15423 1.74618 11.6665 5.39101 14.7844 9.93792 17.3612 15.2848 19.347 21.2422 20.6276 27.5812 20.7641 29.5822 17.7799 29.7857 17.6501 27.8828 17.6762 28.0772 16.4332 21.9244 16.4804 22.1011 14.5537 16.3212 14.6253 16.4975 12.1393 11.3391 12.2531 11.5356 9.26989 7.1851 9.42641 7.37708 6.13246 3.95883 6.42681 4.19555 2.88426 2.0203 3.22356 2.17418 1.42121 1.61483 1.71568 1.67462-0.148817 1.48817ZM23.6466 27.8865 19.5773 34.1603 14.6939 28.4972Z" transform="matrix(-1.00563 1.22465e-16 1.23154e-16 1 97.1876 15.4132)"/><path d="M0.15933-1.48708 2.06002-1.28343 4.05279-0.619176 7.71902 1.6213 10.9885 5.02426 13.9178 9.38556 16.3681 14.4797 18.2317 20.1346 19.3846 26.2196 19.5019 27.8308 16.5186 28.048 16.4076 26.5223 16.4298 26.6922 15.3111 20.7879 15.3601 20.9776 13.5577 15.5084 13.6304 15.6886 11.2687 10.7787 11.3749 10.9643 8.57815 6.80027 8.74122 7.00258 5.69587 3.83293 5.99447 4.07291 2.63838 2.02196 2.9453 2.16464 1.26725 1.60529 1.58087 1.67353-0.15933 1.48708ZM22.3766 26.122 18.336 32.4143 13.4268 26.7735Z" transform="matrix(-1.00563 1.22465e-16 1.23154e-16 1 71.9392 59.1668)"/></g></svg>',
    },
    TASK_TYPE_VQA: {
      transform: "matrix(0.25, 0, 0, 0.25, 3, 2)",
      viewBox: "0 0 189 98",
      svg: '<svg width="189" height="98" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip4376"><rect x="0" y="0" width="189" height="98"/></clipPath></defs><g clip-path="url(#clip4376)"><rect x="0" y="0" width="189" height="97.6678" fill="#FFFFFF"/><path d="M159.256 41.2501C156.327 42.5817 154.272 45.699 154.272 49.3322 154.272 54.1765 157.926 58.1036 162.432 58.1036 166.939 58.1036 170.592 54.1765 170.592 49.3322 170.592 44.4879 166.939 40.5608 162.432 40.5608 161.305 40.5608 160.232 40.8062 159.256 41.2501ZM157.769 24.417 167.095 24.417 167.095 32.8013 170.133 34.1316 175.695 28.1523 182.29 35.2407 176.744 41.2018C177.28 42.0724 177.653 43.0428 177.942 44.0548L185.5 44.0548 185.5 54.0792 178.023 54.0792C177.662 55.5681 177.116 56.9726 176.398 58.2539L181.722 63.9767 175.127 71.065 169.356 64.8614C168.668 65.3437 167.895 65.6367 167.095 65.8632L167.095 74.2475 157.769 74.2475 157.769 65.8631 155.021 64.6453 149.472 70.6093 142.878 63.521 148.24 57.7574C147.617 56.6253 147.158 55.3847 146.841 54.0792L139.5 54.0792 139.5 44.0548 146.923 44.0548 148.245 40.9052 142.875 35.1327 149.469 28.0443 155.016 34.007C155.861 33.4518 156.795 33.0773 157.769 32.8013Z" stroke="#000000" stroke-width="0.333333" stroke-miterlimit="8" fill-rule="evenodd"/><path d="M140.058 22.0173 133.94 18.8051 134.008 18.8387 127.744 15.9446 127.854 15.9903 121.235 13.5488 121.422 13.6044 114.341 11.9946 114.476 12.0189 110.636 11.5083 110.745 11.5187 106.604 11.2712 106.677 11.2738 97.9131 11.175 98.0315 11.1716 89.4865 11.7487 89.5702 11.7407 85.5887 12.2342 85.6512 12.2251 82.05 12.8259 82.2156 12.7886 75.9783 14.5697 76.1906 14.4914 70.7369 16.985 70.8853 16.9068 67.6532 18.8471 66.1053 16.286 69.4094 14.3025 75.0428 11.7267 81.4709 9.89108 85.1871 9.27107 89.2417 8.76852 97.8878 8.18464 106.747 8.28457 110.979 8.5375 114.941 9.06439 122.185 10.7111 128.951 13.207 135.305 16.1421 141.457 19.372ZM70.5689 20.5374 60.5629 21.5968 65.7162 12.9835Z"/><path d="M64.1385 76.641 70.3768 79.6151 70.3073 79.5841 76.6793 82.2347 76.5674 82.1933 83.2761 84.3779 83.087 84.3296 90.2255 85.6654 90.0894 85.6463 93.9464 86.0086 93.8374 86.0024 97.9846 86.0901 97.9118 86.0904 106.673 85.8515 106.555 85.8594 115.071 84.9536 114.987 84.9648 118.947 84.3183 118.885 84.3298 122.46 83.5907 122.296 83.6343 128.459 81.6142 128.25 81.7007 133.603 78.9988 133.458 79.0827 136.612 77.0194 138.258 79.5189 135.034 81.6282 129.505 84.4191 123.152 86.501 119.463 87.2637 115.431 87.9221 106.814 88.8386 97.9574 89.0801 93.7192 88.9904 89.7395 88.6165 82.4373 87.2501 75.5788 85.0167 69.1166 82.3286 62.8439 79.3381ZM133.633 75.4426 143.591 73.9985 138.775 82.8039Z"/><path d="M0 11.9835C-4.02773e-15 5.36519 14.1641-1.52566e-15 31.6363-3.05131e-15 49.1086-6.10263e-15 63.2726 5.36519 63.2726 11.9835 63.2726 18.6018 49.1086 23.967 31.6363 23.967 14.1641 23.967-2.01386e-14 18.6018 0 11.9835Z" stroke="#000000" stroke-width="1.32994" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.868236 -0.499577 -0.501276 -0.865292 13.7639 74.1574)"/><path d="M0 11.9835C-4.02773e-15 5.36519 14.1641-1.52566e-15 31.6363-3.05131e-15 49.1086-6.10263e-15 63.2726 5.36519 63.2726 11.9835 63.2726 18.6018 49.1086 23.967 31.6363 23.967 14.1641 23.967-2.01386e-14 18.6018 0 11.9835Z" stroke="#000000" stroke-width="1.32994" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.868236 0.499577 0.501276 -0.865292 2.0433 42.5481)"/><path d="M0 10.9627C-4.31398e-15 4.90817 15.1707-1.3957e-15 33.8847-2.7914e-15 52.5988-5.5828e-15 67.7695 4.90817 67.7695 10.9627 67.7695 17.0173 52.5988 21.9254 33.8847 21.9254 15.1707 21.9254-2.15699e-14 17.0173 0 10.9627Z" stroke="#000000" stroke-width="1.32881" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(6.14406e-17 1 1.0034 -6.12323e-17 24.5001 14.4509)"/><path d="M29.5001 48.3356C29.5001 45.0332 31.9625 42.356 35.0001 42.356 38.0376 42.356 40.5001 45.0332 40.5001 48.3356 40.5001 51.6381 38.0376 54.3153 35.0001 54.3153 31.9625 54.3153 29.5001 51.6381 29.5001 48.3356Z" stroke="#000000" stroke-width="1.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>',
    },
    TASK_TYPE_RESULT_EVALUATION: {
      transform: "matrix(0.35, 0, 0, 0.35, 4, -3)",
      viewBox: "0 0 188.96001 98.400002",
      svg: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.96001 98.400002" height="98.400002" width="188.96001" xml:space="preserve" id="svg2" version="1.1"><defs id="defs6"><clipPath id="clipPath18" clipPathUnits="userSpaceOnUse"><path style="clip-rule:evenodd" id="path16" d="M 0,2.2888e-5 H 141.72 V 73.800023 H 0 Z"/></clipPath><clipPath id="clipPath28" clipPathUnits="userSpaceOnUse"><path style="clip-rule:evenodd" id="path26" d="M 2.183e-6,12.84 H 43.320002 V 60.96 H 2.183e-6 Z"/></clipPath><clipPath id="clipPath38" clipPathUnits="userSpaceOnUse"><path id="path36" d="M 0,0 H 11.658 V 11.657 H 0 Z"/></clipPath></defs><g transform="matrix(1.3333333,0,0,-1.3333333,0,98.4)" id="g10"><g id="g12"><g clip-path="url(#clipPath18)" id="g14"><path id="path20" style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none" d="M 0,7.629e-6 H 141.72 V 73.800008 H 0 Z"/></g></g><g id="g22"><g clip-path="url(#clipPath28)" id="g24"><g transform="matrix(0.66833,-1.2e-8,0,0.66833,-4.8,12.84)" id="g30"><g transform="scale(6.1761,6.1763)" id="g32"><g clip-path="url(#clipPath38)" id="g34"><path id="path40" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 2.485,9.8924 h -0.72 v -8.16 h 8.16 v 0.72 h -7.44 z"/><path id="path42" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 3.205,3.1724 h 1.32 v 4.2 h -1.32 z"/><path id="path44" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 5.005,3.1724 h 1.32 v 6.72 h -1.32 z"/><path id="path46" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 6.805,3.1724 h 1.32 v 4.2 h -1.32 z"/><path id="path48" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 8.605,3.1724 h 1.32 v 2.16 h -1.32 z"/></g></g></g></g></g><path id="path50" style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none" d="m 43.32,40.11 h 9.3 v 5.13 l 9.3,-10.26 -9.3,-10.26 v 5.13 h -9.3 z"/><path id="path52" style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none" d="m 96.72,40.186 h 7.33 l 2.27,7.334 2.27,-7.334 h 7.33 l -5.93,-4.532 2.26,-7.334 -5.93,4.533 -5.93,-4.533 2.26,7.334 z"/><path id="path54" style="fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 96.72,40.186 h 7.33 l 2.27,7.334 2.27,-7.334 h 7.33 l -5.93,-4.532 2.26,-7.334 -5.93,4.533 -5.93,-4.533 2.26,7.334 z"/><path id="path56" style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none" d="m 72.12,40.14 h 7.38 l 2.28,7.38 2.28,-7.38 h 7.38 l -5.97,-4.56 2.28,-7.38 -5.97,4.561 -5.97,-4.561 2.28,7.38 z"/><path id="path58" style="fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 72.12,40.14 h 7.38 l 2.28,7.38 2.28,-7.38 h 7.38 l -5.97,-4.56 2.28,-7.38 -5.97,4.561 -5.97,-4.561 2.28,7.38 z"/><path id="path60" style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none" d="M 129.96,47.52 V 32.853 l -5.93,-4.533 2.26,7.334 -5.93,4.532 h 7.33 z"/><path id="path62" style="fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="M 129.96,47.52 V 32.853 l -5.93,-4.533 2.26,7.334 -5.93,4.532 h 7.33 z"/><path id="path64" style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none" d="m 130.32,47.52 2.27,-7.334 h 7.33 l -5.93,-4.532 2.26,-7.334 -5.93,4.533 z"/><path id="path66" style="fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-opacity:1" d="m 130.32,47.52 2.27,-7.334 h 7.33 l -5.93,-4.532 2.26,-7.334 -5.93,4.533 z"/></g></svg>',
    },
    TASK_TYPE_CUTTING2: {
      transform: "matrix(0.22, 0, 0, 0.22, 3, 3)",
      svg: '<svg width="184" height="178" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="0" y="0" width="184" height="178"/></clipPath></defs><g clip-path="url(#clip0)"><rect x="0" y="0" width="184" height="178.334" fill="#FFFFFF"/><path d="M5.50005 66.6248 168.297 66.6249" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M5.50005 109.705 168.297 109.706" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M5.50005 155.792 168.297 155.792" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M0 0 0.00115486 105.686" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1 0 0 1.00188 48.5012 67.6267)"/><path d="M30.5001 155.792C30.5001 146.385 38.3351 138.76 48.0001 138.76 57.665 138.76 65.5001 146.385 65.5001 155.792 65.5001 165.198 57.665 172.824 48.0001 172.824 38.3351 172.824 30.5001 165.198 30.5001 155.792Z" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M37 66.1238C37 60.0373 42.1487 55.1032 48.5 55.1032 54.8513 55.1032 60 60.0373 60 66.1238 60 72.2104 54.8513 77.1445 48.5 77.1445 42.1487 77.1445 37 72.2104 37 66.1238Z" fill-rule="evenodd"/><path d="M113.5 109.705C113.5 100.299 121.111 92.6736 130.5 92.6736 139.889 92.6736 147.5 100.299 147.5 109.705 147.5 119.112 139.889 126.737 130.5 126.737 121.111 126.737 113.5 119.112 113.5 109.705Z" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M118 155.291C118 149.204 123.149 144.27 129.5 144.27 135.851 144.27 141 149.204 141 155.291 141 161.377 135.851 166.311 129.5 166.311 123.149 166.311 118 161.377 118 155.291Z" fill-rule="evenodd"/><path d="M0 0 0.0901837 61.4767" stroke="#000000" stroke-width="0.533333" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(-1 0 0 1.00188 130.59 92.6736)"/><g><g><g><path d="M119.542 73.9271C114.351 73.9271 110.104 69.6802 110.104 64.4896 110.104 59.299 114.351 55.0521 119.542 55.0521 124.732 55.0521 128.979 59.299 128.979 64.4896 128.979 69.6802 124.732 73.9271 119.542 73.9271ZM82.8927 40.2667C78.0167 38.3792 75.8146 32.874 77.7021 27.9979 79.5896 23.1219 85.0948 20.9198 89.9708 22.8073 94.8469 24.6948 97.049 30.2 95.1615 35.076 93.274 39.7948 87.7687 42.1542 82.8927 40.2667ZM78.6458 77.0729C75.9719 77.0729 73.9271 75.0281 73.9271 72.3542 73.9271 69.6802 75.9719 67.6354 78.6458 67.6354 81.3198 67.6354 83.3646 69.6802 83.3646 72.3542 83.3646 75.0281 81.3198 77.0729 78.6458 77.0729ZM119.542 45.6146C115.452 45.6146 111.677 46.8729 108.531 49.075L93.274 57.5687 101.768 42.3115C102.554 41.0531 103.341 39.7948 103.97 38.3792 107.902 28.7844 103.183 17.774 93.5885 13.8417 83.9938 9.90938 72.9833 14.6281 69.051 24.2229 65.1188 33.8177 69.8375 44.8281 79.4323 48.7604 81.3198 49.5469 83.2073 49.8615 85.0948 50.0187L70.9385 64.175 67.4781 71.8823 22.0208 97.5208 12.5833 113.25 58.1979 92.8021 37.75 138.417 53.4792 128.979 78.8031 83.6792 86.5104 80.2188 100.667 66.0625C101.453 75.8146 109.632 83.3646 119.542 83.3646 129.923 83.3646 138.417 74.8708 138.417 64.4896 138.417 54.1083 129.923 45.6146 119.542 45.6146Z" transform="matrix(1 0 0 1.00188 42 -10.0188)"/></g></g></g></g></svg>',
    },
    TASK_TYPE_RESULT_COMBINATION: {
      transform: "matrix(0.22, 0, 0, 0.22, 3, 3)",
      svg: '<svg width="228" height="149" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip0"><rect x="0" y="0" width="228" height="149"/></clipPath><clipPath id="clip1"><rect x="142" y="33" width="81" height="80"/></clipPath><clipPath id="clip2"><rect x="142" y="33" width="81" height="80"/></clipPath></defs><g clip-path="url(#clip0)"><rect x="0" y="0" width="228" height="149.392" fill="#FFFFFF"/><g clip-path="url(#clip1)"><g clip-path="url(#clip2)"></g></g><path d="M0 0C17.3517 0 34.7033 9.35775 34.7033 18.7155 34.7033 28.0732 52.055 37.4309 69.4066 37.4309" stroke="#000000" stroke-width="8.33943" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(1 0 0 -1.00263 79 111.724)"/><path d="M8.6471 3.00789 2.99999 3.00789 2.99999 71.187 66.9999 71.187 66.9999 65.1713 8.6471 65.1713Z" fill-rule="evenodd"/><path d="M17 24.0632 29.0001 24.0632 29.0001 57.1502 17 57.1502Z" fill-rule="evenodd"/><path d="M34 40.1053 46.0002 40.1053 46.0002 57.1501 34 57.1501Z" fill-rule="evenodd"/><g><g><g><path d="M33.25 20.5625C31.8063 20.5625 30.625 19.3813 30.625 17.9375 30.625 16.4938 31.8063 15.3125 33.25 15.3125 34.6938 15.3125 35.875 16.4938 35.875 17.9375 35.875 19.3813 34.6938 20.5625 33.25 20.5625ZM23.0563 11.2C21.7 10.675 21.0875 9.14376 21.6125 7.78751 22.1375 6.43126 23.6688 5.81876 25.025 6.34376 26.3813 6.86876 26.9938 8.40001 26.4688 9.75626 25.9438 11.0688 24.4125 11.725 23.0563 11.2ZM21.875 21.4375C21.1313 21.4375 20.5625 20.8688 20.5625 20.125 20.5625 19.3813 21.1313 18.8125 21.875 18.8125 22.6188 18.8125 23.1875 19.3813 23.1875 20.125 23.1875 20.8688 22.6188 21.4375 21.875 21.4375ZM33.25 12.6875C32.1125 12.6875 31.0625 13.0375 30.1875 13.65L25.9438 16.0125 28.3063 11.7688C28.525 11.4188 28.7438 11.0688 28.9188 10.675 30.0125 8.00626 28.7 4.94376 26.0313 3.85 23.3625 2.75625 20.3 4.06875 19.2063 6.73751 18.1125 9.40626 19.425 12.4688 22.0938 13.5625 22.6188 13.7813 23.1438 13.8688 23.6688 13.9125L19.7313 17.85 18.7688 19.9938 6.12501 27.125 3.5 31.5 16.1875 25.8125 10.5 38.5 14.875 35.875 21.9188 23.275 24.0625 22.3125 28 18.375C28.2188 21.0875 30.4938 23.1875 33.25 23.1875 36.1375 23.1875 38.5 20.825 38.5 17.9375 38.5 15.05 36.1375 12.6875 33.25 12.6875Z" transform="matrix(1 0 0 1.00263 28 -1.00263)"/></g></g></g><path d="M8.6471 77.2028 2.99999 77.2028 2.99999 146.384 66.9999 146.384 66.9999 140.28 8.6471 140.28Z" fill-rule="evenodd"/><path d="M17 85.2238 29.0001 85.2238 29.0001 132.348 17 132.348Z" fill-rule="evenodd"/><path d="M34 122.321 46.0002 122.321 46.0002 132.348 34 132.348Z" fill-rule="evenodd"/><g><g><g><path d="M33.25 20.5625C31.8063 20.5625 30.625 19.3813 30.625 17.9375 30.625 16.4938 31.8063 15.3125 33.25 15.3125 34.6938 15.3125 35.875 16.4938 35.875 17.9375 35.875 19.3813 34.6938 20.5625 33.25 20.5625ZM23.0563 11.2C21.7 10.675 21.0875 9.14376 21.6125 7.78751 22.1375 6.43126 23.6688 5.81876 25.025 6.34376 26.3813 6.86876 26.9938 8.40001 26.4688 9.75626 25.9438 11.0688 24.4125 11.725 23.0563 11.2ZM21.875 21.4375C21.1313 21.4375 20.5625 20.8688 20.5625 20.125 20.5625 19.3813 21.1313 18.8125 21.875 18.8125 22.6188 18.8125 23.1875 19.3813 23.1875 20.125 23.1875 20.8688 22.6188 21.4375 21.875 21.4375ZM33.25 12.6875C32.1125 12.6875 31.0625 13.0375 30.1875 13.65L25.9438 16.0125 28.3063 11.7688C28.525 11.4188 28.7438 11.0688 28.9188 10.675 30.0125 8.00626 28.7 4.94376 26.0313 3.85 23.3625 2.75625 20.3 4.06875 19.2063 6.73751 18.1125 9.40626 19.425 12.4688 22.0938 13.5625 22.6188 13.7813 23.1438 13.8688 23.6688 13.9125L19.7313 17.85 18.7688 19.9938 6.12501 27.125 3.5 31.5 16.1875 25.8125 10.5 38.5 14.875 35.875 21.9188 23.275 24.0625 22.3125 28 18.375C28.2188 21.0875 30.4938 23.1875 33.25 23.1875 36.1375 23.1875 38.5 20.825 38.5 17.9375 38.5 15.05 36.1375 12.6875 33.25 12.6875Z" transform="matrix(1 0 0 1.00263 28 74.1949)"/></g></g></g><path d="M77 35.0921C94.8217 35.0921 112.643 44.9693 112.643 54.8464 112.643 64.7235 130.465 74.6006 148.287 74.6006" stroke="#000000" stroke-width="8.33943" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><g><g><g><path d="M16.5017 11.5512 11.5512 11.5512 11.5512 67.6569 67.6569 67.6569 67.6569 62.7064 16.5017 62.7064Z" transform="matrix(1.01 0 0 1 158 32.0843)"/><path d="M21.4522 28.8779 30.5281 28.8779 30.5281 57.7559 21.4522 57.7559Z" transform="matrix(1.01 0 0 1 158 32.0843)"/><path d="M33.8284 11.5512 42.9044 11.5512 42.9044 57.7559 33.8284 57.7559Z" transform="matrix(1.01 0 0 1 158 32.0843)"/><path d="M46.2047 28.8779 55.2806 28.8779 55.2806 57.7559 46.2047 57.7559Z" transform="matrix(1.01 0 0 1 158 32.0843)"/><path d="M58.581 42.9044 67.6569 42.9044 67.6569 57.7559 58.581 57.7559Z" transform="matrix(1.01 0 0 1 158 32.0843)"/></g></g></g><path d="M148.5 63.6671 164.5 74.6961 148.5 85.7251Z" stroke="#000000" stroke-width="1.33782" stroke-miterlimit="8" fill-rule="evenodd"/></g></svg>',
    },
  };

  return quantMESVGMap[svgId];
}
