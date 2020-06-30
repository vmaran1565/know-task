const serviceData = require("./serviceData");
const config = serviceData.config;
let overAllData = serviceData.data;
const mergeColumns = [];
const applyConfigFn = (data) => {
  let obj = {};
  config.forEach((el) => {
    obj[el.HeaderName] =
      typeof el.Column == "function" ? el.Column(data) : data[el.HeaderName];
    el.Merge && !mergeColumns.includes(el.HeaderName)
      ? mergeColumns.push(el.HeaderName)
      : "";
  });
  return obj;
};
const mergeDataFn = (data) => {
  data = data.map((el) => {
    return (el = applyConfigFn(el));
  });
  const mergeData = data.reduce((reducer, object) => {
    mergeColumns
      .reduce(
        (mergeColumn, key, i, { length }) =>
          (mergeColumn[object[key]] =
            mergeColumn[object[key]] || (i + 1 === length ? [] : {})),
        reducer
      )
      .push(object);

    return reducer;
  }, {});
  return mergeData;
};

console.log(mergeDataFn(overAllData));
