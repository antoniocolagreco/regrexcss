const classes = (...args: (string | undefined)[]): string => {
  let result = '';
  for (let element of args) {
    if (typeof element !== 'string') continue;
    result += `${element} `;
  }
  return result.trimEnd();
};

export default classes;
