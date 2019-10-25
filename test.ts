const s1 = '波特酒';
const s2 = '*波特酒';

const test = s => {
  const regex = /^\*?(.*)/g;
  console.log(regex.exec(s));
};

test(s1);
test(s2);
