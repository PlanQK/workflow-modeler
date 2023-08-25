/*
THIS CLASS IS DEPRECATED AND SHALL ONLY BE USED FOR TESTING NEW SVG ICON SIZES
 */

const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Received request");

  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");

  if (req.method === "GET" && req.url === "/data-objects") {
    // Create a list of JSON objects
    const data = quantmeDataObjects;

    // Set the response content type to JSON
    res.setHeader("Content-Type", "application/json");

    // Send the JSON data as the response body
    res.end(JSON.stringify(data));
  } else {
    // Return a 404 error for all other requests
    res.statusCode = 404;
    res.end("Not found");
  }
});

server.listen(8100, () => {
  // console.log(JSON.stringify(quantmeDataObjects));
  console.log("Server listening on http://localhost:8100/");
});

const quantmeDataObjects = [
  {
    name: "Quantum Circuit Object",
    id: "Quantum-Circuit-Object",
    description:
      "data object for storing and transferring all relevant data about a quantum circuit",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Quantum Circuit Info",
    icon: {
      transform: "matrix(0.14, 0, 0, 0.14, 5, 5)",
      svg: '<svg width="133" height="112" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="clip85612665212"><rect x="339" y="357" width="133" height="112"/></clipPath></defs><g clip-path="url(#clip85612665212)" transform="translate(-339 -357)"><path d="M340.5 370.5 469.803 370.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 408.5 469.803 408.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M340.5 450.5 469.803 450.5" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M380.5 370.5 380.5 465.311" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M364.5 450C364.5 440.887 371.664 433.5 380.5 433.5 389.337 433.5 396.5 440.887 396.5 450 396.5 459.113 389.337 466.5 380.5 466.5 371.664 466.5 364.5 459.113 364.5 450Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M370.5 371.5C370.5 365.425 375.201 360.5 381 360.5 386.799 360.5 391.5 365.425 391.5 371.5 391.5 377.575 386.799 382.5 381 382.5 375.201 382.5 370.5 377.575 370.5 371.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M416.5 408.5C416.5 399.664 423.664 392.5 432.5 392.5 441.337 392.5 448.5 399.664 448.5 408.5 448.5 417.337 441.337 424.5 432.5 424.5 423.664 424.5 416.5 417.337 416.5 408.5Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M421.5 449C421.5 443.201 426.425 438.5 432.5 438.5 438.575 438.5 443.5 443.201 443.5 449 443.5 454.799 438.575 459.5 432.5 459.5 426.425 459.5 421.5 454.799 421.5 449Z" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="#404040" fill-rule="evenodd"/><path d="M432.5 393.5 432.5 448.456" stroke="#000000" stroke-width="5.33333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>',
    },
    attributes: [
      {
        name: "quantum-circuit",
        label: "Quantum Circuit",
        type: "string",
        value: "",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
      {
        name: "programming-language",
        label: "Programming Language",
        type: "string",
        value: "",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "Result Object",
    id: "Result-Object",
    description: "data object to transfer the results of quantum computations",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Result",
    icon: {
      transform: "matrix(0.24, 0, 0, 0.24, 3, 3)",
      svg: '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Icons_BarChart_LTR" overflow="hidden"><path d="M20 14 14 14 14 82 82 82 82 76 20 76Z" fill="#404040"/><rect x="26" y="35" width="11" height="35" fill="#404040"/><rect x="41" y="14" width="11" height="56" fill="#404040"/><rect x="56" y="35" width="11" height="35" fill="#404040"/><rect x="71" y="52" width="11" height="18" fill="#404040"/></svg>',
    },
    attributes: [
      {
        name: "Execution-Result",
        label: "Execution Result",
        type: "string",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "Evaluation Result Object",
    id: "Evaluation-Result-Object",
    description:
      "data object to transfer the evaluated results of quantum computations",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Evaluation Result",
    icon: {
      transform: "matrix(0.09, 0, 0, 0.09, 3, 3)",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="247" height="278" overflow="hidden"><defs><clipPath id="clip17861765333"><rect x="0" y="0" width="247" height="278"/></clipPath></defs><g clip-path="url(#clip17861765333)"><rect x="0" y="0" width="247" height="277.686" fill="#FFFFFF"/><path d="M175.5 28.9271 202.238 28.9273 210.5 2.50624 218.762 28.9273 245.5 28.9271 223.869 45.256 232.131 71.677 210.5 55.3478 188.869 71.677 197.131 45.256Z" stroke="#000000" stroke-width="0.666217" stroke-miterlimit="8" fill-rule="evenodd"/><path d="M210.5 2.50624 218.762 28.9276 245.5 28.927 223.869 45.2558 232.131 71.6772 210.5 55.3477Z" stroke="#000000" stroke-width="0.666217" stroke-miterlimit="8" fill="#FFFFFF" fill-rule="evenodd"/><path d="M90.5001 28.3075 116.856 28.3077 125 1.5037 133.144 28.3077 159.5 28.3075 138.178 44.8731 146.322 71.677 125 55.1111 103.678 71.677 111.822 44.8731Z" stroke="#000000" stroke-width="0.666217" stroke-miterlimit="8" fill-rule="evenodd"/><path d="M2.50012 28.9271 28.8559 28.9273 37 2.50624 45.1442 28.9273 71.4999 28.9271 50.1776 45.256 58.3222 71.677 37 55.3478 15.6779 71.677 23.8224 45.256Z" stroke="#000000" stroke-width="0.666217" stroke-miterlimit="8" fill-rule="evenodd"/><g><g><g><path d="M74.1188 120.397C71.5375 120.397 69.1406 119.844 66.7438 118.922 62.8719 117.447 59.5531 114.681 57.1563 111.178 56.9719 111.178 56.6031 110.994 56.4188 110.994L34.2938 154.506 52.9156 150.266 62.3188 167.781 85.3656 122.794C82.7844 122.425 80.2031 121.319 77.9906 120.028 76.7 120.213 75.4094 120.397 74.1188 120.397Z" transform="matrix(1 0 0 1.00248 36 109.27)"/><path d="M112.653 118C110.072 119.106 107.306 119.659 104.541 119.659 103.066 119.659 101.775 119.475 100.3 119.291 97.5344 121.134 94.4 122.425 91.0813 122.794L115.419 166.675 125.006 151.003 143.813 154.138 120.397 112.1C118.369 114.681 115.788 116.709 112.653 118Z" transform="matrix(1 0 0 1.00248 36 109.27)"/><path d="M87.9469 95.1375C70.4313 95.1375 56.05 80.9407 56.05 63.2406 56.05 45.5406 70.4313 31.3438 87.9469 31.3438 105.463 31.3438 119.844 45.5406 119.844 63.2406 119.844 80.9407 105.463 95.1375 87.9469 95.1375ZM142.338 63.2406C142.338 59.1844 140.678 55.4969 137.913 52.9156 139.388 49.4125 139.572 45.3563 137.913 41.6688 136.438 38.35 133.856 35.7688 130.722 34.4781 130.538 31.1594 129.247 27.8406 126.666 25.2594 123.716 22.3094 120.028 21.0188 116.156 21.2031 114.866 17.7 112.1 14.75 108.228 13.275 104.909 11.9844 101.222 11.9844 98.0875 13.275 95.5063 11.0625 92.3719 9.5875 88.6844 9.5875 84.6282 9.5875 80.9407 11.2469 78.3594 14.0125 74.8563 12.5375 70.8 12.3531 67.1125 14.0125 63.7938 15.4875 61.2125 18.0688 59.9219 21.2031 56.6031 21.3875 53.2844 22.6781 50.7031 25.2594 47.7531 28.2094 46.4625 31.8969 46.6469 35.7688 43.1438 37.0594 40.1938 39.825 38.7188 43.6969 37.4281 47.0156 37.4281 50.7031 38.7188 53.8375 36.5063 56.4188 35.0313 59.5531 35.0313 63.2406 35.0313 67.2969 36.6906 70.9844 39.4563 73.5656 37.9813 77.0688 37.7969 81.125 39.4563 84.8125 40.9313 88.1313 43.5125 90.7125 46.6469 92.0032 46.8313 95.3219 48.1219 98.6406 50.7031 101.222 53.6531 104.172 57.3406 105.463 61.2125 105.278 62.5031 108.781 65.2688 111.731 69.1406 113.206 72.4594 114.497 76.1469 114.497 79.2813 113.206 81.8625 115.419 84.9969 116.894 88.6844 116.894 92.7406 116.894 96.4281 115.234 99.0094 112.469 102.513 113.944 106.569 114.128 110.256 112.469 113.575 110.994 116.156 108.413 117.447 105.278 120.766 105.094 124.084 103.803 126.666 101.222 129.616 98.2719 130.906 94.5844 130.722 90.7125 134.225 89.4219 137.175 86.6563 138.65 82.7844 139.941 79.4656 139.941 75.7781 138.65 72.6438 140.863 70.2469 142.338 66.9281 142.338 63.2406Z" transform="matrix(1 0 0 1.00248 36 109.27)"/></g></g></g></g></svg>',
    },
    attributes: [
      {
        name: "Evaluation Result",
        label: "Evaluation Result",
        type: "string",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "Parameterization Object",
    id: "Parameterization-Object",
    description:
      "data object to transfer optimization parameters, e.g., in variational quantum algorithms",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Parameterization",
    icon: {
      transform: "matrix(0.12, 0, 0, 0.12, 6, 4)",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="102" height="195" overflow="hidden"><defs><clipPath id="clip768123746553"><rect x="0" y="0" width="102" height="195"/></clipPath></defs><g clip-path="url(#clip768123746553)"><rect x="0" y="0" width="102" height="194.667" fill="#FFFFFF"/><path d="M43.9249-56.4036C42.3027-56.4036 40.7429-56.0604 39.2454-55.3741 37.748-54.6878 36.2609-53.6063 34.7843-52.1296 33.3076-50.653 31.8622-48.6148 30.448-46.0151 29.0337-43.4154 27.817-40.5349 26.7979-37.3736 25.7789-34.2123 24.9781-30.9367 24.3958-27.5467 23.8135-24.1566 23.5223-21.1097 23.5223-18.406 23.5223-11.5844 25.4773-8.17353 29.3873-8.17353 32.7149-8.17353 36.2609-10.2637 40.0253-14.4441 43.7897-18.6244 47.0654-24.4166 49.8523-31.8206 50.6842-35.8138 51.1002-40.0357 51.1002-44.4865 51.1002-48.5628 50.4762-51.5681 49.2283-53.5023 47.9805-55.4365 46.2127-56.4036 43.9249-56.4036ZM42.7394-62.8925C47.6893-62.8925 51.6305-61.6342 54.563-59.1177 57.4955-56.6012 59.2945-52.8056 59.96-47.7309L60.7711-47.7309 66.6985-61.8942 83.6071-61.8942 82.8584-57.7762C81.2777-55.8212 78.6052-52.2544 74.8408-47.0758 71.0764-41.8971 67.4472-36.6457 63.9532-31.3215 63.9116-29.9904 63.766-27.5779 63.5164-24.0838 63.2669-20.7146 63.1421-18.2812 63.1421-16.7838 63.1421-13.3314 63.454-11.0124 64.078-9.82695 64.7019-8.64148 65.7626-8.04874 67.26-8.04874 68.3831-8.04874 69.5894-8.50629 70.8788-9.4214 72.1683-10.3365 73.8321-11.9795 75.8703-14.3505L80.3626-9.85815C76.6606-6.07295 73.1562-3.31725 69.8493-1.59103 66.5425 0.135186 62.9341 0.998294 59.0241 0.998294 55.6549 0.998294 53.0967 0 51.3497-1.99659 49.6027-3.99317 48.7292-6.94646 48.7292-10.8564 48.7292-12.3123 48.854-13.8513 49.1036-15.4735L48.1677-15.5983C44.2161-10.6069 41.0132-7.08164 38.5591-5.02266 36.1049-2.96368 33.578-1.44545 30.9783-0.46795 28.3786 0.509546 25.4357 0.998294 22.1496 0.998294 18.822 0.998294 15.9831 0.249573 13.6329-1.24787 11.2828-2.74531 9.51499-4.99147 8.32951-7.98635 7.14404-10.9812 6.5513-14.4961 6.5513-18.5308 6.5513-26.9747 8.06954-34.6075 11.106-41.4292 14.1425-48.2509 18.4268-53.5335 23.959-57.2771 29.4913-61.0207 35.7514-62.8925 42.7394-62.8925Z" fill-rule="evenodd" transform="matrix(1.00171 0 0 1 17.1843 63.7188)"/><text fill="#000000" fill-opacity="0" font-family="Arial,Arial_MSFontService,sans-serif" font-size="63.8908" x="6.5513" y="-6.98805">𝜶</text><path d="M55.6549-82.796C51.4537-82.796 47.7933-80.5498 44.6736-76.0575 41.554-71.5652 38.9542-64.7227 36.8745-55.5301L28.4514-17.5325C28.1602-16.2015 28.0146-14.7664 28.0146-13.2274 28.0146-10.898 28.9609-9.02624 30.8535-7.61199 32.7461-6.19774 35.1275-5.49061 37.9975-5.49061 40.9092-5.49061 43.561-6.5305 45.9527-8.61028 48.3444-10.6901 50.2058-13.5498 51.5369-17.1894 52.868-20.829 53.5335-24.791 53.5335-29.0753 53.5335-33.4844 52.5664-36.8225 50.6322-39.0894 48.698-41.3564 45.7135-42.885 41.6788-43.6753L43.1138-50.0395C49.1868-50.913 54.0118-53.4503 57.5891-57.6514 61.1663-61.8526 62.9549-67.1144 62.9549-73.437 62.9549-76.5566 62.2998-78.8964 60.9895-80.4562 59.6792-82.0161 57.901-82.796 55.6549-82.796ZM56.9027-89.2849C64.6811-89.2849 70.6293-87.8706 74.7472-85.0421 78.8652-82.2136 80.9242-78.1165 80.9242-72.7506 80.9242-66.7609 78.8964-61.5718 74.8408-57.1835 70.7852-52.7952 64.8059-49.3739 56.9027-46.9198L56.7779-46.0463C61.811-44.3825 65.5962-41.9075 68.1335-38.6215 70.6709-35.3354 71.9395-31.3423 71.9395-26.642 71.9395-21.2761 70.6813-16.503 68.1647-12.3227 65.6482-8.14233 61.967-4.87708 57.1211-2.52693 52.2752-0.176781 46.6078 0.998294 40.1189 0.998294 37.2072 0.998294 34.3683 0.717523 31.6022 0.155984 28.8361-0.405557 26.6212-1.12308 24.9573-1.99659L18.6556 26.9539 0.935901 26.9539 18.0941-51.1625C19.9243-59.4401 22.3888-66.3449 25.4877-71.8771 28.5866-77.4093 32.7045-81.6937 37.8416-84.7302 42.9786-87.7666 49.3323-89.2849 56.9027-89.2849Z" fill-rule="evenodd" transform="matrix(1.00171 0 0 1 2.51774 165.199)"/><text fill="#000000" fill-opacity="0" font-family="Arial,Arial_MSFontService,sans-serif" font-size="116.239" x="0.935901" y="12.4241">𝜷</text></g></svg>',
    },
    attributes: [
      {
        name: "Parameterization",
        label: "Parameterization",
        type: "string",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
  {
    name: "Initial State Object",
    id: "Initial-State-Object",
    description:
      "data object to transfer the initial state used to warm-start a quantum computations",
    appliesTo: "dataflow:DataMapObject",
    groupLabel: "Initial State",
    icon: {
      transform: "matrix(0.16, 0, 0, 0.16, 6, 3)",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="102" height="195" overflow="hidden"><defs><clipPath id="clip765128907311"><rect x="0" y="0" width="102" height="195"/></clipPath></defs><g clip-path="url(#clip765128907311)"><rect x="0" y="0" width="102" height="194.667" fill="#FFFFFF"/><path d="M24.3217-55.5925C22.3485-55.5925 20.697-55.0062 19.3673-53.8338 18.0375-52.6613 16.9651-50.9741 16.1501-48.7721 15.3351-46.5701 14.756-43.8892 14.4129-40.7292 14.0697-37.5692 13.8981-34.0018 13.8981-30.0268 13.8981-20.7042 14.7632-13.8624 16.4933-9.50134 18.2234-5.1403 20.9044-2.95978 24.5362-2.95978 27.9964-2.95978 30.563-5.01162 32.2359-9.11528 33.9088-13.2189 34.7453-19.5746 34.7453-28.1823 34.7453-34.7596 34.3163-40.0858 33.4584-44.1608 32.6005-48.2359 31.4066-51.1599 29.8767-52.933 28.3467-54.706 26.4951-55.5925 24.3217-55.5925ZM24.5362-59.2386C30.7989-59.2386 35.4602-56.8221 38.5201-51.9893 41.58-47.1564 43.1099-39.8498 43.1099-30.0697 43.1099-19.9464 41.4727-12.2895 38.1984-7.09919 34.924-1.90885 30.1412 0.686326 23.8499 0.686326 17.6729 0.686326 13.076-1.74441 10.059-6.6059 7.042-11.4674 5.53351-18.8454 5.53351-28.7399 5.53351-34.0018 5.99821-38.5487 6.92761-42.3807 7.85701-46.2127 9.15817-49.3798 10.8311-51.882 12.504-54.3843 14.513-56.2359 16.8579-57.437 19.2029-58.638 21.7623-59.2386 24.5362-59.2386Z" fill-rule="evenodd" transform="matrix(1.00171 0 0 1 24.7401 74.3839)"/><text fill="#000000" fill-opacity="0" font-family="Arial,Arial_MSFontService,sans-serif" font-size="59.9249" x="5.53351" y="-6.80429">0</text><text font-family="Calibri,Calibri_MSFontService,sans-serif" font-weight="400" font-size="88" transform="matrix(1 0 0 0.998294 -6.81669 69)">|</text><text font-family="Cambria Math,Cambria Math_MSFontService,sans-serif" font-weight="400" font-size="88" transform="matrix(1 0 0 0.998294 73.35 69)">⟩</text><path d="M27.7104-59.2386 30.0697-59.2386C29.8981-56.4933 29.8123-52.6899 29.8123-47.8284L29.8123-11.1957C29.8123-9.53708 29.9053-8.28597 30.0911-7.44236 30.277-6.59875 30.6059-5.91242 31.0777-5.38338 31.5496-4.85433 32.2288-4.43968 33.1153-4.13941 34.0018-3.83914 35.1171-3.61036 36.4611-3.45308 37.8052-3.2958 39.5782-3.18856 41.7801-3.13137L41.7801 0 10.0804 0 10.0804-3.13137C13.2547-3.27435 15.521-3.46738 16.8793-3.71045 18.2377-3.95353 19.2743-4.31814 19.9893-4.80429 20.7042-5.29044 21.2261-5.97676 21.555-6.86327 21.8838-7.74977 22.0482-9.19392 22.0482-11.1957L22.0482-45.9839C22.0482-47.1278 21.8481-47.9642 21.4477-48.4933 21.0474-49.0223 20.4611-49.2868 19.689-49.2868 18.7739-49.2868 17.4727-48.815 15.7855-47.8713 14.0983-46.9276 12.0107-45.6264 9.52278-43.9678L7.63539-47.2708Z" fill-rule="evenodd" transform="matrix(1.00171 0 0 1 24.7401 168.643)"/><text fill="#000000" fill-opacity="0" font-family="Arial,Arial_MSFontService,sans-serif" font-size="59.2386" x="7.63539" y="-7.40482">1</text><text font-family="Calibri,Calibri_MSFontService,sans-serif" font-weight="400" font-size="88" transform="matrix(1 0 0 0.998294 -6.81669 160)">|</text><text font-family="Cambria Math,Cambria Math_MSFontService,sans-serif" font-weight="400" font-size="88" transform="matrix(1 0 0 0.998294 73.35 160)">⟩</text></g></svg>',
    },
    attributes: [
      {
        name: "Initial State",
        label: "Initial State",
        type: "string",
        bindTo: {
          name: "content",
          type: "KeyValueMap",
        },
      },
    ],
  },
];
