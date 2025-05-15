// Import the http module to make HTTP requests. From this point, you can use `http` methods to make HTTP requests.
import http from 'k6/http';

// Import the sleep function to introduce delays. From this point, you can use the `sleep` function to introduce delays in your test script.
import { check, sleep } from 'k6';

import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';

export const options = {

  scenarios: {
    ConstVU: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
    RampVU: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      gracefulRampDown: '0s',
    },
    VUiterations: {
      executor: 'per-vu-iterations',
      vus: 10,
      iterations: 10,
      maxDuration: '20s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
};

 const url = 'https://jsonplaceholder.typicode.com/';

 const payload = JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

export default function (){
   const res = http.get(url+'/posts/1');
   const resPost = http.post(url+ '/posts/', payload, params);
   const getallres = http.get(url + '/posts/')

   check(res,{
    'status is 200': (r) => r.status === 200}
   );

   check(resPost,{
    'status is 201': (r) => r.status === 201,
    'response body is correct': (r) => r.json().title === 'foo', 
  });

  /*check(getallres, {
    'status is 200': (r) => r.status === 200
  });*/
  expect(getallres.status, 'status code for get all posts').to.equal(200);
}
